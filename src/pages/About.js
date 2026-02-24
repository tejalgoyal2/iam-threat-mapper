import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-[10px] tracking-widest text-terminal-gray uppercase mb-2">
          module::04 // project information
        </div>
        <h1 className="font-display text-2xl text-terminal-cyan text-glow-cyan tracking-wider mb-2">
          ABOUT
        </h1>
      </div>

      <div className="space-y-6">
        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // what is iam threat mapper?
          </div>
          <p className="text-terminal-gray-light text-xs leading-relaxed mb-3">
            IAM Threat Mapper is an educational security tool that helps defenders
            understand how identity-based attacks chain together and evaluate
            their organization's IAM maturity. It combines interactive attack path
            visualization with a structured maturity assessment framework.
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <Link to="/attack-paths" className="text-[10px] px-2 py-1 border border-terminal-green/30 text-terminal-green tracking-widest hover:bg-terminal-green/10 transition-colors">
              ATTACK VISUALIZER
            </Link>
            <Link to="/assessment" className="text-[10px] px-2 py-1 border border-terminal-amber/30 text-terminal-amber tracking-widest hover:bg-terminal-amber/10 transition-colors">
              MATURITY ASSESSMENT
            </Link>
          </div>
        </div>

        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // methodology
          </div>
          <div className="space-y-3 text-xs text-terminal-gray-light leading-relaxed">
            <p>
              Attack scenarios are modeled on real-world identity breaches including
              the 2022 Twilio/Cloudflare phishing campaign, the Uber Lapsus$ breach,
              the 2023 MGM/Caesars Scattered Spider attacks, and ongoing Microsoft 365
              token theft and OAuth consent phishing campaigns.
            </p>
            <p>
              Each attack node is mapped to MITRE ATT&CK techniques for identity-based
              threats. Defensive controls are aligned with NIST 800-63 (Digital Identity
              Guidelines) and CIS Controls v8 (Identity Management and Access Control).
            </p>
            <p>
              The maturity assessment uses a 4-level model (Initial, Developing, Defined,
              Optimized) with weighted scoring across 7 IAM domains. Category weights
              reflect the relative impact of each domain on overall identity security posture.
            </p>
          </div>
        </div>

        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // project scope
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '5', label: 'Attack Scenarios', color: 'text-terminal-red' },
              { value: '32', label: 'Attack Nodes', color: 'text-terminal-green' },
              { value: '18', label: 'MITRE Techniques', color: 'text-terminal-cyan' },
              { value: '20', label: 'Assessment Qs', color: 'text-terminal-amber' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`font-display text-xl ${stat.color} tracking-wider`}>{stat.value}</div>
                <div className="text-[9px] text-terminal-gray tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // tech stack
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Frontend', value: 'React 18' },
              { label: 'Styling', value: 'Tailwind CSS 3' },
              { label: 'Visualization', value: 'Cytoscape.js' },
              { label: 'Navigation', value: 'React Router v6' },
              { label: 'Attack Framework', value: 'MITRE ATT&CK' },
              { label: 'IAM Framework', value: 'NIST 800-63 / CIS v8' },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-terminal-gray/50">{item.label}: </span>
                <span className="text-terminal-gray-light">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // keyboard navigation
          </div>
          <p className="text-xs text-terminal-gray-light leading-relaxed mb-3">
            This tool supports full keyboard navigation for a terminal-native experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
            {[
              { keys: '?', desc: 'Toggle shortcut overlay' },
              { keys: '1-4', desc: 'Navigate between pages' },
              { keys: '← →', desc: 'Navigate attack chain nodes' },
              { keys: 'Esc', desc: 'Deselect / close panels' },
              { keys: '1-4 (assessment)', desc: 'Select answer option' },
              { keys: 'Enter', desc: 'Next question / confirm' },
            ].map((s) => (
              <div key={s.keys} className="flex items-center justify-between py-1 px-2 border border-terminal-border/20">
                <span className="text-terminal-gray tracking-wider">{s.desc}</span>
                <span className="text-terminal-green/60 tracking-wider font-mono">{s.keys}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-terminal-red/20 bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-red/60 uppercase mb-3">
            // disclaimer
          </div>
          <p className="text-terminal-gray text-xs leading-relaxed">
            This tool is for educational and defensive security purposes only.
            It does not provide real-time threat intelligence, vulnerability scanning,
            or penetration testing capabilities. Attack scenarios are generalized models
            based on publicly documented techniques and incident reports. Not affiliated
            with any vendor including Okta, Microsoft, or CrowdStrike.
          </p>
        </div>

        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // author
          </div>
          <p className="text-terminal-gray-light text-xs leading-relaxed mb-3">
            Built by <span className="text-terminal-green font-bold">Tejal Goyal</span> —
            Cybersecurity Analyst specializing in Identity & Access Management,
            Endpoint Detection & Response, and Security Operations.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/tejalgoyal2" target="_blank" rel="noopener noreferrer"
              className="text-[10px] px-2 py-1 border border-terminal-green/30 text-terminal-green tracking-widest hover:bg-terminal-green/10 transition-colors">
              GITHUB
            </a>
            <a href="https://linkedin.com/in/tejalgoyal" target="_blank" rel="noopener noreferrer"
              className="text-[10px] px-2 py-1 border border-terminal-cyan/30 text-terminal-cyan tracking-widest hover:bg-terminal-cyan/10 transition-colors">
              LINKEDIN
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
