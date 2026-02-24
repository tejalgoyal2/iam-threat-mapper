/**
 * IAM Threat Mapper - Attack Scenario Data
 * 
 * Each scenario contains:
 * - metadata (id, title, severity, description, mitre_tactics)
 * - nodes (attack steps with controls and MITRE technique refs)
 * - edges (connections between nodes)
 * - caseStudy (real-world breach that used this attack pattern)
 */

const attackScenarios = [
  // ============================================================
  // SCENARIO 1: Credential Phishing → Account Takeover → Priv Esc
  // ============================================================
  {
    id: 'credential-phish',
    title: 'Credential Phishing',
    subtitle: 'Stolen password → Account takeover → Privilege escalation',
    severity: 'CRITICAL',
    description:
      'A targeted phishing campaign steals user credentials, bypasses weak MFA, and escalates to admin-level access through dormant role assignments.',
    mitre_tactics: ['Initial Access', 'Credential Access', 'Privilege Escalation', 'Collection'],
    caseStudy: {
      title: 'Twilio & Cloudflare Phishing Campaign',
      date: 'August 2022',
      victim: 'Twilio (breached), Cloudflare (blocked)',
      attackGroup: '0ktapus',
      summary:
        'A mass phishing campaign targeted over 130 organizations with fake Okta login pages. Attackers sent SMS messages to employees with links to AiTM proxy sites that captured credentials and MFA tokens in real-time. Twilio was breached — attackers accessed customer data for 163 customers. Cloudflare was targeted identically but blocked the attack because employees used FIDO2 hardware keys, which cannot be phished.',
      impact: 'Twilio: 163 customer accounts compromised, downstream impact on Signal users. Over 130 orgs targeted in the same campaign.',
      keyLesson: 'Cloudflare survived the exact same attack because of FIDO2 keys. This is the single most cited real-world proof that phishing-resistant MFA works.',
      sources: [
        'Twilio Incident Report (Aug 2022)',
        'Cloudflare Blog: "The mechanics of a sophisticated phishing scam"',
        'Group-IB: 0ktapus campaign analysis',
      ],
    },
    nodes: [
      {
        id: 'cp-1',
        label: 'Phishing Email\nDelivered',
        status: 'entry',
        details: {
          what: 'Attacker sends targeted email with a fake Okta login page (adversary-in-the-middle proxy).',
          missing: 'No email link sandboxing or real-time URL rewriting.',
          blockedBy: 'Email security gateway with URL analysis and sandboxing (e.g., Proofpoint, Mimecast).',
          mitre: 'T1566.002 — Phishing: Spearphishing Link',
        },
      },
      {
        id: 'cp-2',
        label: 'User Enters\nCredentials',
        status: 'exploited',
        details: {
          what: 'User submits username and password to attacker-controlled AiTM proxy site.',
          missing: 'No phishing-resistant MFA (FIDO2/WebAuthn) — only push/SMS.',
          blockedBy: 'FIDO2 security keys — cryptographically bound to real domain, won\'t authenticate to fake site.',
          mitre: 'T1056.003 — Input Capture: Web Portal Capture',
        },
      },
      {
        id: 'cp-3',
        label: 'Attacker Replays\nCredentials',
        status: 'exploited',
        details: {
          what: 'Attacker uses stolen credentials against real Okta tenant via the AiTM proxy.',
          missing: 'No device trust policy — any device can authenticate.',
          blockedBy: 'Device trust / managed device requirement blocks unmanaged attacker device.',
          mitre: 'T1078.004 — Valid Accounts: Cloud Accounts',
        },
      },
      {
        id: 'cp-4',
        label: 'MFA Bypassed\nvia AiTM Proxy',
        status: 'exploited',
        details: {
          what: 'AiTM proxy relays the MFA challenge in real-time — user completes MFA on the fake site, attacker captures the session token.',
          missing: 'Non-phishing-resistant MFA (push, SMS, TOTP) is all bypassable via AiTM.',
          blockedBy: 'FIDO2/WebAuthn — the only MFA type that defeats AiTM proxies (domain-bound challenge).',
          mitre: 'T1111 — Multi-Factor Authentication Interception',
        },
      },
      {
        id: 'cp-5',
        label: 'Session\nEstablished',
        status: 'exploited',
        details: {
          what: 'Attacker now holds a valid Okta session token — appears as legitimate user.',
          missing: 'No impossible travel detection or session anomaly rules.',
          blockedBy: 'Sign-on policy with network zone restrictions + behavioral anomaly detection in SIEM.',
          mitre: 'T1550.004 — Use Alternate Authentication Material: Web Session Cookie',
        },
      },
      {
        id: 'cp-6',
        label: 'Privilege Escalation\nvia Dormant Role',
        status: 'exploited',
        details: {
          what: 'Attacker discovers user has a dormant admin role assignment that was never revoked.',
          missing: 'No regular access reviews — stale admin roles persist indefinitely.',
          blockedBy: 'Periodic access reviews + just-in-time (JIT) privileged access with time-bound role activation.',
          mitre: 'T1078.004 — Valid Accounts: Cloud Accounts (Privilege Escalation)',
        },
      },
      {
        id: 'cp-7',
        label: 'Admin Console\nData Exfiltration',
        status: 'exploited',
        details: {
          what: 'Attacker exports user directory, application assignments, and policy configurations from Okta admin console.',
          missing: 'No admin action alerting and no separate authentication policy for admin operations.',
          blockedBy: 'Step-up authentication for admin actions + real-time admin audit alerts to SOC.',
          mitre: 'T1087.004 — Account Discovery: Cloud Account + T1530 — Data from Cloud Storage',
        },
      },
    ],
    edges: [
      { source: 'cp-1', target: 'cp-2' },
      { source: 'cp-2', target: 'cp-3' },
      { source: 'cp-3', target: 'cp-4' },
      { source: 'cp-4', target: 'cp-5' },
      { source: 'cp-5', target: 'cp-6' },
      { source: 'cp-6', target: 'cp-7' },
    ],
  },

  // ============================================================
  // SCENARIO 2: MFA Fatigue Attack
  // ============================================================
  {
    id: 'mfa-fatigue',
    title: 'MFA Fatigue Attack',
    subtitle: 'Push notification spam → MFA bypass → Session hijack',
    severity: 'HIGH',
    description:
      'Attacker uses breached credentials and overwhelms the user with MFA push notifications until they approve one out of frustration.',
    mitre_tactics: ['Credential Access', 'Initial Access', 'Lateral Movement'],
    caseStudy: {
      title: 'Uber Breach by Lapsus$',
      date: 'September 2022',
      victim: 'Uber Technologies',
      attackGroup: 'Lapsus$ (attributed to 18-year-old attacker)',
      summary:
        'An attacker purchased stolen credentials of an Uber contractor from the dark web. After the password worked, the attacker repeatedly spammed the contractor\'s phone with MFA push notifications. After over an hour of notifications, the attacker also contacted the contractor via WhatsApp, impersonating Uber IT support and claiming the pushes would stop if approved. The contractor approved, giving the attacker full access.',
      impact: 'Attacker accessed Uber\'s internal Slack, Google Workspace, HackerOne bug bounty dashboard, AWS console, and financial dashboards. Source code repositories were also accessed. The attacker posted screenshots of internal systems in Uber\'s own Slack channels.',
      keyLesson: 'Push-based MFA is fundamentally vulnerable to social engineering. The human element — fatigue plus social pressure — made the technical control irrelevant. Number matching and FIDO2 would have prevented this entirely.',
      sources: [
        'Uber Security Incident Report (Sep 2022)',
        'Krebs on Security: Uber breach analysis',
        'BleepingComputer: Lapsus$ Uber attack details',
      ],
    },
    nodes: [
      {
        id: 'mf-1',
        label: 'Credential\nStuffing',
        status: 'entry',
        details: {
          what: 'Attacker uses credentials from a third-party data breach (password reuse).',
          missing: 'No breached password detection or credential screening.',
          blockedBy: 'Password screening against known breach databases (e.g., Have I Been Pwned integration).',
          mitre: 'T1110.004 — Brute Force: Credential Stuffing',
        },
      },
      {
        id: 'mf-2',
        label: 'Valid Password\nConfirmed',
        status: 'partial',
        details: {
          what: 'Password matches — MFA is now the only remaining barrier.',
          missing: 'Password was reused from another compromised service.',
          blockedBy: 'This is an expected state if password is valid. Defense depends on MFA strength.',
          mitre: 'T1078 — Valid Accounts',
        },
      },
      {
        id: 'mf-3',
        label: 'Repeated MFA\nPush Spam',
        status: 'exploited',
        details: {
          what: 'Attacker triggers 20+ push notifications to the user\'s phone, often at night or during meetings.',
          missing: 'No push rate limiting and no number matching (Okta Verify number challenge).',
          blockedBy: 'Rate limit MFA push attempts (max 3 per 10 min) + require number matching on every push.',
          mitre: 'T1621 — Multi-Factor Authentication Request Generation',
        },
      },
      {
        id: 'mf-4',
        label: 'User Approves\nPush (Fatigue)',
        status: 'exploited',
        details: {
          what: 'User taps "Approve" to stop the flood of notifications — common human behavior.',
          missing: 'No phishing-resistant MFA deployed; push-based MFA is inherently vulnerable to fatigue.',
          blockedBy: 'Replace push MFA with FIDO2 — eliminates the fatigue attack vector entirely.',
          mitre: 'T1621 — Multi-Factor Authentication Request Generation',
        },
      },
      {
        id: 'mf-5',
        label: 'Session Token\nIssued',
        status: 'exploited',
        details: {
          what: 'Attacker receives a valid session — indistinguishable from a legitimate login.',
          missing: 'No session binding to device or IP; no login anomaly correlation.',
          blockedBy: 'Token binding + device trust + session anomaly detection (impossible travel, new device).',
          mitre: 'T1550.004 — Use Alternate Authentication Material: Web Session Cookie',
        },
      },
      {
        id: 'mf-6',
        label: 'Lateral Movement\nto SSO Apps',
        status: 'exploited',
        details: {
          what: 'Attacker accesses SSO-connected apps — email, cloud storage, HR systems, code repos — silently.',
          missing: 'No per-app step-up authentication for sensitive applications.',
          blockedBy: 'App-level sign-on policies requiring re-authentication for sensitive resources (email, finance, admin tools).',
          mitre: 'T1021 — Remote Services (Lateral Movement via SSO)',
        },
      },
    ],
    edges: [
      { source: 'mf-1', target: 'mf-2' },
      { source: 'mf-2', target: 'mf-3' },
      { source: 'mf-3', target: 'mf-4' },
      { source: 'mf-4', target: 'mf-5' },
      { source: 'mf-5', target: 'mf-6' },
    ],
  },

  // ============================================================
  // SCENARIO 3: Session Token Theft
  // ============================================================
  {
    id: 'token-theft',
    title: 'Session Token Theft',
    subtitle: 'Token extraction → Session replay → Lateral movement',
    severity: 'HIGH',
    description:
      'Malware or a malicious browser extension steals the user\'s session cookie, allowing the attacker to bypass all authentication entirely.',
    mitre_tactics: ['Credential Access', 'Defense Evasion', 'Lateral Movement', 'Persistence'],
    caseStudy: {
      title: 'Microsoft Token Theft Campaigns',
      date: '2022–2024 (ongoing)',
      victim: 'Multiple enterprises via Microsoft 365 / Entra ID',
      attackGroup: 'Multiple threat actors (Storm-1167, Midnight Blizzard, others)',
      summary:
        'Microsoft Threat Intelligence documented a surge in token theft attacks where adversaries use infostealer malware (Raccoon, RedLine, Lumma) to extract session tokens from browsers. Once stolen, these tokens are replayed from attacker infrastructure, completely bypassing password and MFA. The stolen session appears identical to a legitimate login. Microsoft also documented AiTM phishing kits that steal tokens in real-time during the authentication flow.',
      impact: 'Token theft became the #1 identity attack vector by 2023 according to Microsoft\'s Digital Defense Report. Attackers gained access to email, SharePoint, Teams, and Azure resources across thousands of organizations.',
      keyLesson: 'MFA protects the authentication moment, but not the session after. Token binding, continuous access evaluation (CAE), and short session lifetimes are essential to close this gap.',
      sources: [
        'Microsoft Digital Defense Report 2023',
        'Microsoft Security Blog: "Token theft: The new frontier"',
        'Microsoft Entra documentation on Continuous Access Evaluation',
      ],
    },
    nodes: [
      {
        id: 'tt-1',
        label: 'Malware / Browser\nExtension Compromise',
        status: 'entry',
        details: {
          what: 'User installs malicious browser extension or infostealer malware (e.g., Raccoon, RedLine).',
          missing: 'No endpoint browser extension controls or extension allowlisting.',
          blockedBy: 'EDR detection (CrowdStrike) + browser extension allowlisting via Group Policy or MDM.',
          mitre: 'T1176 — Browser Extensions',
        },
      },
      {
        id: 'tt-2',
        label: 'Session Cookie\nExtracted',
        status: 'exploited',
        details: {
          what: 'Malware exfiltrates Okta/app session cookies from browser local storage.',
          missing: 'No token binding to device — cookies are portable across machines.',
          blockedBy: 'Device-bound session tokens (token binding) — makes cookies useless on another device.',
          mitre: 'T1539 — Steal Web Session Cookie',
        },
      },
      {
        id: 'tt-3',
        label: 'Session Replayed\nfrom New Device',
        status: 'exploited',
        details: {
          what: 'Attacker imports the stolen cookie into their browser — full session, no auth required.',
          missing: 'No continuous session evaluation (device fingerprint, IP, behavior).',
          blockedBy: 'Continuous Access Evaluation — checks device/IP/behavior throughout session, not just at login.',
          mitre: 'T1550.004 — Use Alternate Authentication Material: Web Session Cookie',
        },
      },
      {
        id: 'tt-4',
        label: 'SSO Apps Accessed\nWithout Re-Auth',
        status: 'exploited',
        details: {
          what: 'Valid Okta session grants silent SSO into all assigned applications.',
          missing: 'No per-app re-authentication for sensitive applications.',
          blockedBy: 'Step-up auth policies on high-value apps (e.g., re-auth required for AWS console, finance apps).',
          mitre: 'T1021 — Remote Services',
        },
      },
      {
        id: 'tt-5',
        label: 'Persistence via\nApp-Level Tokens',
        status: 'exploited',
        details: {
          what: 'Attacker generates API tokens, OAuth grants, or app passwords in connected applications.',
          missing: 'No OAuth grant monitoring or token inventory management.',
          blockedBy: 'OAuth app governance + token audit + consent policies restricting token creation.',
          mitre: 'T1098.003 — Account Manipulation: Additional Cloud Roles',
        },
      },
      {
        id: 'tt-6',
        label: 'Okta Session Revoked\nbut Access Persists',
        status: 'exploited',
        details: {
          what: 'Security team revokes the Okta session, but app-level tokens still work independently.',
          missing: 'No universal session revocation propagated to downstream apps.',
          blockedBy: 'Okta-to-app token revocation integration (CAEP/SSE) + enforce short token lifetimes.',
          mitre: 'T1098 — Account Manipulation (Persistence)',
        },
      },
    ],
    edges: [
      { source: 'tt-1', target: 'tt-2' },
      { source: 'tt-2', target: 'tt-3' },
      { source: 'tt-3', target: 'tt-4' },
      { source: 'tt-4', target: 'tt-5' },
      { source: 'tt-5', target: 'tt-6' },
    ],
  },

  // ============================================================
  // SCENARIO 4: OAuth / Consent Phishing
  // ============================================================
  {
    id: 'oauth-phish',
    title: 'OAuth Consent Phishing',
    subtitle: 'Malicious app grant → Persistent API access → Silent data harvesting',
    severity: 'CRITICAL',
    description:
      'Attacker registers a malicious OAuth application and tricks users into granting it broad API permissions. Unlike credential phishing, this attack survives password changes and MFA — because it uses delegated tokens.',
    mitre_tactics: ['Initial Access', 'Persistence', 'Collection', 'Discovery'],
    caseStudy: {
      title: 'Microsoft 365 OAuth Consent Phishing Waves',
      date: '2021–2024 (ongoing campaigns)',
      victim: 'Thousands of Microsoft 365 tenants globally',
      attackGroup: 'Multiple threat actors (Storm-1283, Midnight Blizzard, others)',
      summary:
        'Attackers registered malicious Azure AD applications with names like "Document Viewer" or "Security Update" and sent consent links to targeted users. Once approved, the malicious apps had persistent read access to emails, files, and contacts — completely independent of the user\'s password or MFA. Microsoft documented that Midnight Blizzard (formerly Nobelium, the SolarWinds group) used OAuth app consent as their primary initial access method in campaigns targeting government and NGO organizations.',
      impact: 'Attackers maintained persistent silent access to email and files for months in some cases. Because OAuth tokens survive password resets and MFA changes, detection was extremely difficult. Multiple government agencies and large enterprises were compromised.',
      keyLesson: 'OAuth consent is an authentication bypass that most security teams don\'t monitor. Admin consent workflows, app governance, and OAuth grant auditing are critical controls that most organizations still haven\'t implemented.',
      sources: [
        'Microsoft Security Blog: "Midnight Blizzard OAuth app abuse"',
        'Microsoft: "Detecting and remediating illicit consent grants"',
        'CISA Advisory: AA22-152A (Microsoft 365 security recommendations)',
      ],
    },
    nodes: [
      {
        id: 'oa-1',
        label: 'Malicious OAuth\nConsent Request',
        status: 'entry',
        details: {
          what: 'Attacker registers an app mimicking a legitimate service and sends a "Grant Access" link to users.',
          missing: 'No OAuth app consent restrictions — any user can grant any app.',
          blockedBy: 'Restrict OAuth consent to admin-approved apps only (admin consent workflow).',
          mitre: 'T1566.002 — Phishing: Spearphishing Link',
        },
      },
      {
        id: 'oa-2',
        label: 'User Grants\nPermissions',
        status: 'exploited',
        details: {
          what: 'User clicks "Allow" and grants broad scopes — mail.read, files.readwrite, directory.read, etc.',
          missing: 'No user education on OAuth risks; no consent review or approval workflow.',
          blockedBy: 'Admin consent workflow + user training on recognizing suspicious permission requests.',
          mitre: 'T1528 — Steal Application Access Token',
        },
      },
      {
        id: 'oa-3',
        label: 'Persistent\nAPI Access',
        status: 'exploited',
        details: {
          what: 'App now holds a refresh token — works even if user changes password or resets MFA.',
          missing: 'No OAuth token audit or grant expiration policies.',
          blockedBy: 'Token lifetime limits + periodic OAuth grant reviews + auto-revoke unused grants.',
          mitre: 'T1528 — Steal Application Access Token (Persistence)',
        },
      },
      {
        id: 'oa-4',
        label: 'Silent Data\nHarvesting',
        status: 'exploited',
        details: {
          what: 'Attacker reads emails, downloads files, maps org chart — all via API with no user interaction.',
          missing: 'No anomalous app behavior detection (CASB or equivalent).',
          blockedBy: 'CASB / app activity monitoring + unusual data access volume alerts.',
          mitre: 'T1114.002 — Email Collection: Remote Email Collection',
        },
      },
      {
        id: 'oa-5',
        label: 'Directory\nEnumeration',
        status: 'exploited',
        details: {
          what: 'Malicious app enumerates all users, groups, roles, and app assignments via SCIM/Graph API.',
          missing: 'No scope limitation — directory read granted to non-admin apps.',
          blockedBy: 'Least-privilege scopes + restrict directory enumeration to admin-approved apps only.',
          mitre: 'T1087.004 — Account Discovery: Cloud Account',
        },
      },
      {
        id: 'oa-6',
        label: 'MFA Never\nTriggered',
        status: 'exploited',
        details: {
          what: 'Entire attack chain bypasses MFA — OAuth tokens operate independently of the user\'s auth session.',
          missing: 'No understanding that OAuth grants survive MFA resets and password changes.',
          blockedBy: 'Conditional access on token refresh + short-lived grants + revoke on risk signal.',
          mitre: 'T1550.001 — Use Alternate Authentication Material: Application Access Token',
        },
      },
    ],
    edges: [
      { source: 'oa-1', target: 'oa-2' },
      { source: 'oa-2', target: 'oa-3' },
      { source: 'oa-3', target: 'oa-4' },
      { source: 'oa-3', target: 'oa-5' },
      { source: 'oa-4', target: 'oa-6' },
      { source: 'oa-5', target: 'oa-6' },
    ],
  },

  // ============================================================
  // SCENARIO 5: Helpdesk Social Engineering (MGM/Caesars-style)
  // ============================================================
  {
    id: 'helpdesk-se',
    title: 'Helpdesk Social Engineering',
    subtitle: 'Impersonate employee → Reset MFA → Compromise Identity Provider',
    severity: 'CRITICAL',
    description:
      'Attacker calls IT helpdesk, impersonates an employee, and convinces the agent to reset MFA — gaining full account takeover. This is the attack pattern used in the 2023 MGM Resorts and Caesars Entertainment breaches.',
    mitre_tactics: ['Initial Access', 'Persistence', 'Privilege Escalation', 'Defense Evasion'],
    caseStudy: {
      title: 'MGM Resorts & Caesars Entertainment Breach',
      date: 'September 2023',
      victim: 'MGM Resorts International, Caesars Entertainment',
      attackGroup: 'Scattered Spider (UNC3944 / 0ktapus subgroup)',
      summary:
        'Scattered Spider, a group of primarily English-speaking young adults, used LinkedIn to identify MGM employees and then called the IT helpdesk impersonating them. The helpdesk agents reset MFA factors without adequate identity verification. With access to employee accounts, the attackers escalated to Okta Super Admin, compromised the identity provider, federated into all connected systems, and deployed ALPHV/BlackCat ransomware. Caesars was hit with a similar attack and paid a ~$15M ransom. MGM refused to pay.',
      impact: 'MGM: ~$100M in losses, 10 days of operational disruption across all properties, slot machines and room keys down, guest personal data leaked. Caesars: ~$15M ransom payment. Combined: one of the most expensive identity-based breaches in history.',
      keyLesson: 'The entire attack started with a phone call. No exploit, no malware, no zero-day — just social engineering a helpdesk agent. Identity verification for privileged operations (especially MFA resets) is a critical control that most organizations treat as optional.',
      sources: [
        'MGM Resorts SEC 8-K Filing (Oct 2023)',
        'Bloomberg: "Caesars paid roughly half of $30M ransom"',
        'Okta Security Advisory: "Threat actors targeting Okta admins via social engineering"',
        'Mandiant: UNC3944 Scattered Spider threat profile',
      ],
    },
    nodes: [
      {
        id: 'hs-1',
        label: 'Attacker Calls\nIT Helpdesk',
        status: 'entry',
        details: {
          what: 'Attacker impersonates an employee using OSINT data (name, employee ID, manager name from LinkedIn).',
          missing: 'No standardized identity verification protocol for helpdesk calls.',
          blockedBy: 'Mandatory identity verification: video call, manager approval, or out-of-band verification via known contact.',
          mitre: 'T1656 — Impersonation',
        },
      },
      {
        id: 'hs-2',
        label: 'Helpdesk\nResets MFA',
        status: 'exploited',
        details: {
          what: 'Helpdesk agent resets all MFA factors and issues a temporary password.',
          missing: 'No dual-approval workflow for MFA reset operations.',
          blockedBy: 'Dual-approval for MFA resets (requires both agent + supervisor/manager) + mandatory cooldown period.',
          mitre: 'T1556 — Modify Authentication Process',
        },
      },
      {
        id: 'hs-3',
        label: 'Attacker Enrolls\nOwn MFA Device',
        status: 'exploited',
        details: {
          what: 'Attacker registers their own phone or security key as the user\'s MFA factor during the enrollment window.',
          missing: 'No enrollment restrictions — any device can be enrolled post-reset.',
          blockedBy: 'MFA enrollment restricted to managed devices only + enrollment event alerts to user and SOC.',
          mitre: 'T1098.005 — Account Manipulation: Device Registration',
        },
      },
      {
        id: 'hs-4',
        label: 'Full Account\nTakeover',
        status: 'exploited',
        details: {
          what: 'Attacker now controls password + MFA — creates a fully legitimate session.',
          missing: 'No enhanced monitoring window post-MFA reset.',
          blockedBy: 'Enhanced monitoring for 24-48hrs post MFA reset + force step-up auth for sensitive actions.',
          mitre: 'T1078.004 — Valid Accounts: Cloud Accounts',
        },
      },
      {
        id: 'hs-5',
        label: 'Pivot to Admin\nAccounts',
        status: 'exploited',
        details: {
          what: 'Attacker repeats helpdesk scam targeting users with known admin roles (identified via org chart OSINT).',
          missing: 'No separate verification tier for privileged account resets.',
          blockedBy: 'Tiered verification policy — admin/privileged account resets require CISO or director-level approval.',
          mitre: 'T1078.004 — Valid Accounts: Cloud Accounts (Privilege Escalation)',
        },
      },
      {
        id: 'hs-6',
        label: 'Identity Provider\nCompromise',
        status: 'exploited',
        details: {
          what: 'With Okta Super Admin access, attacker modifies sign-on policies, creates backdoor admin account, disables logging.',
          missing: 'No change management controls on IdP policy modifications.',
          blockedBy: 'Policy change alerts + immutable audit log (SIEM) + IdP changes restricted to break-glass process.',
          mitre: 'T1556 — Modify Authentication Process (Persistence)',
        },
      },
      {
        id: 'hs-7',
        label: 'Downstream Access\nvia Federation',
        status: 'exploited',
        details: {
          what: 'Compromised IdP federates attacker into every SAML/OIDC-connected application across the enterprise.',
          missing: 'No federation anomaly detection or cross-app session correlation.',
          blockedBy: 'Cross-app session monitoring + SIEM correlation on federation events + CAEP integration.',
          mitre: 'T1199 — Trusted Relationship',
        },
      },
    ],
    edges: [
      { source: 'hs-1', target: 'hs-2' },
      { source: 'hs-2', target: 'hs-3' },
      { source: 'hs-3', target: 'hs-4' },
      { source: 'hs-4', target: 'hs-5' },
      { source: 'hs-5', target: 'hs-6' },
      { source: 'hs-6', target: 'hs-7' },
    ],
  },
];

export default attackScenarios;
