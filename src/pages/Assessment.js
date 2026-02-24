import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { assessmentCategories, maturityLevels } from '../data/assessmentQuestions';

const allQuestions = assessmentCategories.flatMap((cat) =>
  cat.questions.map((q) => ({ ...q, categoryId: cat.id, categoryLabel: cat.label }))
);

const SESSION_KEY = 'iam-tm-assessment';

function Assessment() {
  // Restore from session if available
  const saved = sessionStorage.getItem(SESSION_KEY);
  const initial = saved ? JSON.parse(saved) : null;

  const [phase, setPhase] = useState(initial?.phase || 'intro');
  const [currentIndex, setCurrentIndex] = useState(initial?.currentIndex || 0);
  const [answers, setAnswers] = useState(initial?.answers || {});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Persist state to session storage
  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ phase, currentIndex, answers }));
  }, [phase, currentIndex, answers]);

  // Scoring
  const scores = useMemo(() => {
    if (Object.keys(answers).length === 0) return null;

    const categoryScores = assessmentCategories.map((cat) => {
      const catAnswers = cat.questions
        .map((q) => answers[q.id])
        .filter((a) => a !== undefined);
      const avg = catAnswers.length > 0
        ? catAnswers.reduce((sum, v) => sum + v, 0) / catAnswers.length
        : 0;
      return { ...cat, score: avg, answeredCount: catAnswers.length, totalCount: cat.questions.length };
    });

    const totalWeight = categoryScores.reduce((sum, c) => sum + c.weight, 0);
    const weightedSum = categoryScores.reduce((sum, c) => sum + c.score * c.weight, 0);
    const overallScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return { categoryScores, overallScore };
  }, [answers]);

  const currentQuestion = allQuestions[currentIndex];
  const progress = ((currentIndex + 1) / allQuestions.length) * 100;

  const handleAnswer = useCallback((questionId, level) => {
    setAnswers((prev) => ({ ...prev, [questionId]: level }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase('results');
    }
  }, [currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const handleRestart = () => {
    setPhase('intro');
    setCurrentIndex(0);
    setAnswers({});
    setExpandedCategories({});
    sessionStorage.removeItem(SESSION_KEY);
  };

  const getMaturityLevel = (score) => {
    if (score >= 3.5) return maturityLevels[3];
    if (score >= 2.5) return maturityLevels[2];
    if (score >= 1.5) return maturityLevels[1];
    return maturityLevels[0];
  };

  const toggleCategory = (catId) => {
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  // ==========================================
  // KEYBOARD NAVIGATION (question phase only)
  // ==========================================
  // Tell global handler to back off number keys during question phase
  useEffect(() => {
    if (phase === 'questions') {
      document.body.dataset.claimNumberKeys = 'true';
    } else {
      document.body.dataset.claimNumberKeys = 'false';
    }
    return () => {
      document.body.dataset.claimNumberKeys = 'false';
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'questions') return;

    const handleKeyDown = (e) => {
      const q = allQuestions[currentIndex];
      if (!q) return;

      // 1-4 to select answer
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        if (q.answers[idx]) {
          handleAnswer(q.id, q.answers[idx].level);
        }
      }

      // Enter or ArrowRight to go next
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && answers[q.id]) {
        e.preventDefault();
        handleNext();
      }

      // ArrowLeft to go back
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, currentIndex, answers, handleAnswer, handleNext, handlePrev]);

  // ==========================================
  // INTRO SCREEN
  // ==========================================
  if (phase === 'intro') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-[10px] tracking-widest text-terminal-gray uppercase mb-2">
            module::02 // security posture evaluation
          </div>
          <h1 className="font-display text-2xl text-terminal-amber text-glow-amber tracking-wider mb-2">
            IAM MATURITY ASSESSMENT
          </h1>
          <p className="text-terminal-gray-light text-xs max-w-xl leading-relaxed">
            Evaluate your identity and access management controls against industry
            frameworks. Results map directly to exploitable attack paths.
          </p>
        </div>

        <div className="border border-terminal-border bg-terminal-dark/40 p-5 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { value: '20', label: 'questions' },
              { value: '7', label: 'categories' },
              { value: '~5', label: 'minutes' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display text-2xl text-terminal-amber tracking-wider">{s.value}</div>
                <div className="text-[9px] text-terminal-gray tracking-widest uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="text-[10px] tracking-widest text-terminal-gray/50 uppercase mb-3">
            {'>'} categories covered
          </div>
          <div className="space-y-2">
            {assessmentCategories.map((cat, i) => (
              <div key={cat.id} className="flex items-center justify-between py-1.5 px-3 border border-terminal-border/30 bg-terminal-panel/20">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-terminal-amber/40 w-6">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-xs text-terminal-gray-light tracking-wider">{cat.label}</span>
                </div>
                <span className="text-[10px] text-terminal-gray/40">{cat.questions.length}q</span>
              </div>
            ))}
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="border border-terminal-border/30 bg-terminal-dark/20 p-3 mb-6">
          <div className="text-[10px] tracking-widest text-terminal-cyan/40 uppercase mb-2">
            {'>'} keyboard controls
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[10px] text-terminal-gray tracking-wider">
            <span><span className="text-terminal-cyan">1-4</span> select answer</span>
            <span><span className="text-terminal-cyan">Enter / →</span> next question</span>
            <span><span className="text-terminal-cyan">←</span> previous question</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setPhase('questions')}
            className="px-8 py-3 border border-terminal-amber/50 text-terminal-amber text-sm tracking-widest 
                       uppercase font-display hover:bg-terminal-amber/10 hover:border-terminal-amber transition-all"
          >
            {'>'} BEGIN ASSESSMENT {'<'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // QUESTION FLOW
  // ==========================================
  if (phase === 'questions') {
    const currentCategoryIndex = assessmentCategories.findIndex(
      (c) => c.id === currentQuestion.categoryId
    );

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] tracking-widest text-terminal-gray uppercase">
              question {currentIndex + 1} of {allQuestions.length}
            </span>
            <span className="text-[10px] tracking-widest text-terminal-amber">
              {currentQuestion.categoryLabel.toUpperCase()}
            </span>
          </div>
          <div className="w-full h-1 bg-terminal-border">
            <div
              className="h-full bg-terminal-amber transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-1 mt-2">
            {assessmentCategories.map((cat, i) => (
              <div
                key={cat.id}
                className={`h-0.5 flex-1 ${
                  i < currentCategoryIndex ? 'bg-terminal-green' :
                  i === currentCategoryIndex ? 'bg-terminal-amber' : 'bg-terminal-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <div className="text-[10px] tracking-widest text-terminal-gray/40 uppercase mb-3">
            {'>'} {currentQuestion.categoryLabel}
          </div>
          <h2 className="font-display text-lg text-terminal-amber tracking-wider text-glow-amber mb-6">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, i) => {
              const isSelected = answers[currentQuestion.id] === answer.level;
              const lc = {
                1: { border: 'border-terminal-red/30', bg: 'bg-terminal-red/5', text: 'text-terminal-red', label: 'INITIAL' },
                2: { border: 'border-terminal-amber/30', bg: 'bg-terminal-amber/5', text: 'text-terminal-amber', label: 'DEVELOPING' },
                3: { border: 'border-terminal-cyan/30', bg: 'bg-terminal-cyan/5', text: 'text-terminal-cyan', label: 'DEFINED' },
                4: { border: 'border-terminal-green/30', bg: 'bg-terminal-green/5', text: 'text-terminal-green', label: 'OPTIMIZED' },
              }[answer.level];

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(currentQuestion.id, answer.level)}
                  className={`w-full text-left p-4 border transition-all ${
                    isSelected
                      ? `${lc.border} ${lc.bg} shadow-[0_0_8px_rgba(255,255,255,0.03)]`
                      : 'border-terminal-border/50 bg-terminal-dark/30 hover:border-terminal-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Keyboard shortcut */}
                    <div className={`w-5 h-5 border flex-shrink-0 flex items-center justify-center text-[10px] font-bold
                      ${isSelected ? `${lc.border} ${lc.bg} ${lc.text}` : 'border-terminal-border/50 text-terminal-gray/40'}
                    `}>
                      {i + 1}
                    </div>

                    <div className="flex-1">
                      <p className={`text-xs leading-relaxed ${isSelected ? lc.text : 'text-terminal-gray-light'}`}>
                        {answer.text}
                      </p>
                    </div>

                    <span className={`text-[9px] tracking-widest flex-shrink-0 px-1.5 py-0.5 border ${lc.border} ${lc.text}`}>
                      L{answer.level}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`text-xs tracking-widest uppercase font-mono px-4 py-2 border ${
              currentIndex === 0
                ? 'border-terminal-border/30 text-terminal-gray/30 cursor-not-allowed'
                : 'border-terminal-border text-terminal-gray hover:text-terminal-green hover:border-terminal-green/30'
            }`}
          >
            {'<'} prev
          </button>

          {/* Keyboard hint */}
          <div className="text-[9px] text-terminal-gray/30 tracking-wider hidden sm:flex gap-3">
            <span><span className="text-terminal-cyan/40">1-4</span> select</span>
            <span><span className="text-terminal-cyan/40">Enter</span> next</span>
            <span><span className="text-terminal-cyan/40">←→</span> navigate</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id]}
            className={`text-xs tracking-widest uppercase font-mono px-4 py-2 border ${
              !answers[currentQuestion?.id]
                ? 'border-terminal-border/30 text-terminal-gray/30 cursor-not-allowed'
                : 'border-terminal-amber/50 text-terminal-amber hover:bg-terminal-amber/10 hover:border-terminal-amber'
            }`}
          >
            {currentIndex === allQuestions.length - 1 ? 'view results' : 'next'} {'>'}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RESULTS SCREEN
  // ==========================================
  if (phase === 'results' && scores) {
    const overallLevel = getMaturityLevel(scores.overallScore);
    const scorePercent = (scores.overallScore / 4) * 100;

    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="text-[10px] tracking-widest text-terminal-gray uppercase mb-2">
            module::02 // assessment results
          </div>
          <h1 className="font-display text-2xl text-terminal-amber text-glow-amber tracking-wider mb-2">
            MATURITY ASSESSMENT RESULTS
          </h1>
        </div>

        {/* Overall Score — visual gauge */}
        <div className={`border ${overallLevel.borderColor} ${overallLevel.bgColor} p-6 mb-6`}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Score gauge */}
            <div className="flex-shrink-0 w-32 text-center">
              <div className={`font-display text-5xl ${overallLevel.color} tracking-wider`}>
                {scores.overallScore.toFixed(1)}
              </div>
              <div className="text-[9px] text-terminal-gray tracking-widest uppercase mt-1 mb-2">
                out of 4.0
              </div>
              {/* Mini gauge bar */}
              <div className="w-full h-2 bg-terminal-border/30 overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-terminal-red" style={{ width: '25%', opacity: scorePercent >= 0 ? 1 : 0.2 }}></div>
                  <div className="bg-terminal-amber" style={{ width: '25%', opacity: scorePercent >= 25 ? 1 : 0.2 }}></div>
                  <div className="bg-terminal-cyan" style={{ width: '25%', opacity: scorePercent >= 50 ? 1 : 0.2 }}></div>
                  <div className="bg-terminal-green" style={{ width: '25%', opacity: scorePercent >= 75 ? 1 : 0.2 }}></div>
                </div>
              </div>
              <div className="flex justify-between mt-1 text-[8px] text-terminal-gray/30 tracking-wider">
                <span>L1</span><span>L2</span><span>L3</span><span>L4</span>
              </div>
            </div>

            {/* Level info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 border ${overallLevel.borderColor} ${overallLevel.color} font-bold`}>
                  LEVEL {overallLevel.level} — {overallLevel.label}
                </span>
              </div>
              <p className="text-xs text-terminal-gray-light leading-relaxed mb-3">
                {overallLevel.description}
              </p>
              <div className="text-[10px] text-terminal-gray/50 leading-relaxed">
                {scores.overallScore >= 3.5 && "Your organization demonstrates industry-leading IAM controls. Focus on maintaining this posture, automating remaining manual processes, and staying ahead of emerging identity threats."}
                {scores.overallScore >= 2.5 && scores.overallScore < 3.5 && "Your organization has solid IAM foundations with room to mature. Prioritize closing gaps in your weakest categories and moving toward automation and continuous monitoring."}
                {scores.overallScore >= 1.5 && scores.overallScore < 2.5 && "Your IAM controls are developing but have significant gaps. Attackers could exploit multiple weaknesses. Focus on your lowest-scoring categories as immediate priorities."}
                {scores.overallScore < 1.5 && "Critical IAM gaps exist across multiple categories. Your organization is highly vulnerable to identity-based attacks. Immediate action is needed on foundational controls like MFA and privileged access."}
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown — expandable */}
        <div className="mb-6">
          <div className="text-[10px] tracking-widest text-terminal-gray/50 uppercase mb-3">
            {'>'} category breakdown — click to expand
          </div>
          <div className="space-y-3">
            {scores.categoryScores.map((cat) => {
              const catLevel = getMaturityLevel(cat.score);
              const barWidth = (cat.score / 4) * 100;
              const isExpanded = expandedCategories[cat.id];

              return (
                <div key={cat.id} className="border border-terminal-border bg-terminal-dark/40">
                  {/* Category header — clickable */}
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="w-full text-left p-4 hover:bg-terminal-panel/20 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] tracking-widest font-bold px-1.5 py-0.5 border ${catLevel.borderColor} ${catLevel.color}`}>
                          {cat.shortLabel}
                        </span>
                        <span className="text-xs text-terminal-gray-light tracking-wider">
                          {cat.label}
                        </span>
                        <span className="text-terminal-gray/30 text-xs">[{isExpanded ? '−' : '+'}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-sm ${catLevel.color}`}>
                          {cat.score.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-terminal-gray/40">/4.0</span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-terminal-border/30">
                      <div
                        className={`h-full transition-all duration-700 ease-out ${
                          cat.score >= 3.5 ? 'bg-terminal-green' :
                          cat.score >= 2.5 ? 'bg-terminal-cyan' :
                          cat.score >= 1.5 ? 'bg-terminal-amber' : 'bg-terminal-red'
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>

                    {cat.attackScenarioIds && cat.attackScenarioIds.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] text-terminal-gray/40 tracking-wider">DEFENDS AGAINST:</span>
                        {cat.attackScenarioIds.map((sid) => (
                          <span key={sid} className="text-[9px] px-1.5 py-0.5 border border-terminal-red/20 text-terminal-red/60 tracking-wider">
                            {sid.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>

                  {/* Expanded — show individual question answers */}
                  {isExpanded && (
                    <div className="border-t border-terminal-border/30 px-4 py-3 space-y-3">
                      {cat.questions.map((q, qi) => {
                        const userAnswer = answers[q.id];
                        const answerObj = q.answers.find((a) => a.level === userAnswer);
                        const aLc = {
                          1: { color: 'text-terminal-red', border: 'border-terminal-red/20' },
                          2: { color: 'text-terminal-amber', border: 'border-terminal-amber/20' },
                          3: { color: 'text-terminal-cyan', border: 'border-terminal-cyan/20' },
                          4: { color: 'text-terminal-green', border: 'border-terminal-green/20' },
                        }[userAnswer] || { color: 'text-terminal-gray', border: 'border-terminal-border' };

                        return (
                          <div key={q.id} className={`border-l-2 ${aLc.border} pl-3`}>
                            <div className="text-[10px] text-terminal-gray/50 tracking-wider mb-1">
                              Q{qi + 1}: {q.text}
                            </div>
                            <div className="flex items-start gap-2">
                              <span className={`text-[9px] tracking-widest px-1 border ${aLc.border} ${aLc.color} flex-shrink-0`}>
                                L{userAnswer}
                              </span>
                              <span className={`text-[10px] ${aLc.color} leading-relaxed`}>
                                {answerObj?.text || 'Not answered'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Improvements */}
        {scores.categoryScores.filter((c) => c.score < 3).length > 0 && (
          <div className="border border-terminal-red/20 bg-terminal-red/5 p-5 mb-6">
            <div className="text-[10px] tracking-widest text-terminal-red/60 uppercase mb-3">
              {'>'} priority improvements
            </div>
            {scores.categoryScores
              .filter((c) => c.score < 3)
              .sort((a, b) => a.score - b.score)
              .slice(0, 3)
              .map((cat) => (
                <div key={cat.id} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-terminal-red tracking-wider font-bold">{cat.label}</span>
                    <span className="text-[9px] text-terminal-gray/40">(scored {cat.score.toFixed(1)}/4.0)</span>
                  </div>
                  <p className="text-[10px] text-terminal-gray-light leading-relaxed pl-2 border-l border-terminal-red/20">
                    {cat.score < 2
                      ? 'Critical gap — minimal controls in place. This area is directly exploitable by the attack scenarios listed above. Prioritize immediately.'
                      : 'Developing but inconsistent — controls exist but coverage gaps leave room for attackers. Focus on standardizing and enforcing consistently.'
                    }
                  </p>
                </div>
              ))}
          </div>
        )}

        {scores.categoryScores.filter((c) => c.score < 3).length === 0 && (
          <div className="border border-terminal-green/20 bg-terminal-green/5 p-5 mb-6">
            <div className="text-[10px] tracking-widest text-terminal-green/60 uppercase mb-2">
              {'>'} assessment summary
            </div>
            <p className="text-xs text-terminal-green-dim leading-relaxed">
              Strong posture across all categories. Focus on continuous improvement, automation of manual processes, and preparing for emerging identity threats like AI-driven social engineering and post-quantum cryptography impacts on authentication.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRestart}
            className="px-5 py-2 border border-terminal-amber/50 text-terminal-amber text-xs tracking-widest uppercase font-display hover:bg-terminal-amber/10 transition-all"
          >
            retake assessment
          </button>
          <Link
            to="/attack-paths"
            className="px-5 py-2 border border-terminal-green/50 text-terminal-green text-xs tracking-widest uppercase font-display hover:bg-terminal-green/10 transition-all inline-flex items-center"
          >
            view attack paths
          </Link>
          <Link
            to="/"
            className="px-5 py-2 border border-terminal-border text-terminal-gray text-xs tracking-widest uppercase font-display hover:text-terminal-green hover:border-terminal-green/30 transition-all inline-flex items-center"
          >
            home
          </Link>
        </div>
      </div>
    );
  }

  return null;
}

export default Assessment;
