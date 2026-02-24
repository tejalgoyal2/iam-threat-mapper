import React from 'react';

function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] tracking-widest text-terminal-gray uppercase mb-2">
          module::04 // project information
        </div>
        <h1 className="font-display text-2xl text-terminal-cyan text-glow-cyan tracking-wider mb-2">
          ABOUT
        </h1>
      </div>

      {/* Content blocks */}
      <div className="space-y-6">
        {/* What is this */}
        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // what is iam threat mapper?
          </div>
          <p className="text-terminal-gray-light text-xs leading-relaxed">
            IAM Threat Mapper is an educational security tool that helps defenders 
            understand how identity-based attacks chain together and how to evaluate 
            their organization's IAM maturity. It combines interactive attack path 
            visualization with a structured maturity assessment framework.
          </p>
        </div>

        {/* Built with */}
        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // tech stack
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: 'Frontend', value: 'React + Tailwind CSS' },
              { label: 'Visualization', value: 'Cytoscape.js' },
              { label: 'AI Integration', value: 'Claude API (Sonnet)' },
              { label: 'Frameworks', value: 'NIST 800-63 / CIS Controls' },
            ].map((item) => (
              <div key={item.label}>
                <span className="text-terminal-gray/60">{item.label}: </span>
                <span className="text-terminal-gray-light">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border border-terminal-red/20 bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-red/60 uppercase mb-3">
            // disclaimer
          </div>
          <p className="text-terminal-gray text-xs leading-relaxed">
            This tool is for educational and defensive security purposes only. 
            It does not provide real-time threat intelligence, vulnerability scanning, 
            or penetration testing capabilities. Attack scenarios are generalized models 
            based on publicly documented techniques. Not affiliated with any vendor.
          </p>
        </div>

        {/* Author */}
        <div className="border border-terminal-border bg-terminal-dark/40 p-5">
          <div className="text-[10px] tracking-widest text-terminal-cyan/60 uppercase mb-3">
            // author
          </div>
          <p className="text-terminal-gray-light text-xs leading-relaxed">
            Built by <span className="text-terminal-green">Tejal Goyal</span> — 
            Cybersecurity Analyst specializing in Identity & Access Management, 
            Endpoint Detection & Response, and Security Operations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
