# IAM Threat Mapper – Identity Attack Surface Analysis

Interactive attack path visualization and IAM maturity assessment tool. Maps real-world identity-based attack chains to the MITRE ATT&CK framework.

**Live:** [iam.tgoyal.me](https://iam.tgoyal.me)

## What It Does

IAM Threat Mapper helps security teams visualize and understand how attackers exploit identity infrastructure. It has two core modules:

**Attack Path Visualizer** — Interactive node graphs (Cytoscape.js) showing how identity attacks chain together. Each node represents an attack step with MITRE ATT&CK technique mappings, real defensive controls, and what happens when those controls are missing. Includes real-world case studies (Twilio/Cloudflare 0ktapus campaign, SolarWinds, Uber 2022, MGM Resorts, Microsoft Midnight Blizzard).

**IAM Maturity Assessment** — 20-question assessment across 7 categories (MFA, privileged access, lifecycle management, session security, monitoring, federation, credential hygiene). Scores map to maturity levels and link directly to the attack paths they defend against.

## Quick Start

```bash
npm install
npm start         # Dev server at localhost:3000
npm run build     # Production build → /build
```

## Tech Stack

- **Framework**: React 19 (Create React App)
- **Visualization**: Cytoscape.js via react-cytoscapejs
- **Styling**: Tailwind CSS v3
- **Routing**: React Router v7
- **Hosting**: Cloudflare Pages
- **DNS**: Cloudflare

## Deployment (Cloudflare Pages)

| Setting | Value |
|---------|-------|
| Framework preset | None |
| Build command | `npm run build` |
| Build output | `build` |
| Environment variable | `CI` = `false` |

The `CI=false` variable is required because Create React App treats ESLint warnings as build errors in CI environments.

## Structure

```
src/
├── components/
│   ├── AttackGraph.js       # Cytoscape.js attack path renderer
│   ├── CaseStudyPanel.js    # Real-world breach case studies
│   ├── KeyboardHelp.js      # Keyboard shortcut overlay
│   ├── Layout.js            # Nav, footer, page wrapper
│   ├── NodeDetailPanel.js   # Attack step detail sidebar
│   └── ScenarioSelector.js  # Attack scenario picker
├── data/
│   ├── attackScenarios.js   # Attack chains, nodes, edges, case studies
│   └── assessmentQuestions.js # Maturity assessment questions
├── hooks/
│   ├── useGlobalKeyboard.js # Keyboard navigation
│   └── usePageTitle.js      # Dynamic page titles
├── pages/
│   ├── Home.js              # Landing with boot sequence
│   ├── AttackPaths.js       # Attack path visualizer
│   ├── Assessment.js        # IAM maturity assessment
│   ├── About.js             # Methodology and sources
│   └── NotFound.js          # 404 page
├── App.js                   # Router and layout
├── index.js                 # Entry point
└── index.css                # Tailwind config + custom styles
```

## Attack Scenarios

| Scenario | Severity | Real-World Case Study |
|----------|----------|-----------------------|
| Credential Phishing → Account Takeover | Critical | Twilio/Cloudflare 0ktapus (2022) |
| Session Hijacking → Lateral Movement | High | Uber breach via MFA fatigue (2022) |
| Privilege Escalation via Role Misconfiguration | Critical | SolarWinds SUNBURST (2020) |
| Social Engineering → MFA Bypass | Critical | MGM Resorts IT helpdesk attack (2023) |
| OAuth Token Theft → Cloud Access | High | Microsoft Midnight Blizzard (2024) |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-4` | Navigate to pages |
| `?` | Toggle keyboard help |
| `Esc` | Close panels |
| `1-4` (in assessment) | Select answer |
| `Enter` / `→` | Next question |
| `←` | Previous question |

## Data Sources

Attack scenarios are based on publicly documented incidents and MITRE ATT&CK framework techniques. Case studies reference published incident reports from the affected organizations, security vendor analyses, and CISA advisories. See the About page for full methodology.

## Known Issues

- Create React App is no longer actively maintained. Future migration to Vite is planned.
- 29 dependency vulnerabilities (inherited from CRA's dependency tree) — none exploitable in the built static output.

---

Built by [Tejal Goyal](https://tgoyal.me) | Cybersecurity Analyst & ML Engineer
