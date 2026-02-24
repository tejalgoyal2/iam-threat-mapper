/**
 * IAM Maturity Assessment Questions
 * 
 * 7 categories, 20 questions total
 * Each answer maps to a maturity level 1-4:
 *   1 = Initial (ad-hoc, no formal process)
 *   2 = Developing (some controls, inconsistent)
 *   3 = Defined (standardized, documented)
 *   4 = Optimized (automated, continuously improved)
 * 
 * Each category has a weight for final score calculation
 * and maps to specific attack scenarios it defends against.
 */

const assessmentCategories = [
  {
    id: 'mfa',
    label: 'Multi-Factor Authentication',
    shortLabel: 'MFA',
    weight: 1.5,
    description: 'How strong and comprehensive is your MFA deployment?',
    attackScenarioIds: ['credential-phish', 'mfa-fatigue'],
    questions: [
      {
        id: 'mfa-1',
        text: 'What type of MFA is deployed for standard user authentication?',
        answers: [
          { text: 'No MFA deployed, or SMS-only', level: 1 },
          { text: 'Push notifications (e.g., Okta Verify push) without number matching', level: 2 },
          { text: 'Push with number matching, or TOTP authenticator apps', level: 3 },
          { text: 'Phishing-resistant MFA (FIDO2/WebAuthn security keys or passkeys)', level: 4 },
        ],
      },
      {
        id: 'mfa-2',
        text: 'What percentage of your user base has MFA enforced (not just enrolled)?',
        answers: [
          { text: 'Less than 50% of users', level: 1 },
          { text: '50–80% of users', level: 2 },
          { text: '80–95% of users, with known exceptions documented', level: 3 },
          { text: '100% enforced with no exceptions — including service accounts', level: 4 },
        ],
      },
      {
        id: 'mfa-3',
        text: 'How is MFA handled for admin and privileged accounts?',
        answers: [
          { text: 'Same MFA policy as regular users', level: 1 },
          { text: 'Separate MFA policy but same MFA type as regular users', level: 2 },
          { text: 'Stronger MFA required (e.g., FIDO2) with step-up for admin actions', level: 3 },
          { text: 'FIDO2-only with hardware key requirement, plus re-authentication for every admin action', level: 4 },
        ],
      },
      {
        id: 'mfa-4',
        text: 'Are there rate limits or anti-fatigue controls on MFA push notifications?',
        answers: [
          { text: 'No limits — unlimited push attempts allowed', level: 1 },
          { text: 'Basic rate limiting (e.g., max attempts per hour)', level: 2 },
          { text: 'Rate limiting plus number matching enabled', level: 3 },
          { text: 'Phishing-resistant MFA eliminates push entirely, or push is disabled with number matching + rate limits + anomaly alerts', level: 4 },
        ],
      },
    ],
  },
  {
    id: 'pam',
    label: 'Privileged Access Management',
    shortLabel: 'PAM',
    weight: 1.5,
    description: 'How well do you control and monitor privileged accounts?',
    attackScenarioIds: ['credential-phish', 'helpdesk-se'],
    questions: [
      {
        id: 'pam-1',
        text: 'How are admin roles assigned in your identity provider?',
        answers: [
          { text: 'Permanent standing admin roles assigned to individual accounts', level: 1 },
          { text: 'Dedicated admin accounts separate from daily-use accounts, but still permanent', level: 2 },
          { text: 'Time-limited admin access through a request/approval workflow', level: 3 },
          { text: 'Just-in-time (JIT) access with automatic expiration, approval workflow, and audit logging', level: 4 },
        ],
      },
      {
        id: 'pam-2',
        text: 'How do you monitor admin actions in your IdP (Okta, Entra ID, etc.)?',
        answers: [
          { text: 'No specific admin monitoring — rely on standard audit logs', level: 1 },
          { text: 'Audit logs are collected but only reviewed during incidents', level: 2 },
          { text: 'Real-time alerts on critical admin actions (policy changes, user creation, MFA resets)', level: 3 },
          { text: 'Real-time alerts + automated response (e.g., auto-disable account on suspicious admin activity) + SIEM correlation', level: 4 },
        ],
      },
      {
        id: 'pam-3',
        text: 'How many users have standing admin access to your identity provider?',
        answers: [
          { text: 'More than 10, or we are not sure', level: 1 },
          { text: '5–10 users with admin access', level: 2 },
          { text: '3–5 users, documented and reviewed quarterly', level: 3 },
          { text: 'Minimal standing access (1-2 break-glass accounts), all others use JIT elevation', level: 4 },
        ],
      },
    ],
  },
  {
    id: 'gov',
    label: 'Access Reviews & Governance',
    shortLabel: 'GOV',
    weight: 1.0,
    description: 'How consistently do you review and right-size access?',
    attackScenarioIds: ['credential-phish'],
    questions: [
      {
        id: 'gov-1',
        text: 'How often are user access reviews performed?',
        answers: [
          { text: 'No formal access reviews', level: 1 },
          { text: 'Annual access reviews', level: 2 },
          { text: 'Quarterly access reviews with manager attestation', level: 3 },
          { text: 'Continuous or event-driven reviews (role change, department transfer) plus quarterly certification', level: 4 },
        ],
      },
      {
        id: 'gov-2',
        text: 'How do you handle role accumulation (users collecting permissions over time)?',
        answers: [
          { text: 'No process — users keep permissions from all previous roles', level: 1 },
          { text: 'Addressed during access reviews, but inconsistently', level: 2 },
          { text: 'Automated alerts on excessive permissions with periodic cleanup', level: 3 },
          { text: 'Role-based access with automatic revocation on role change + least-privilege enforcement', level: 4 },
        ],
      },
      {
        id: 'gov-3',
        text: 'Do you have an application inventory with documented owners and access policies?',
        answers: [
          { text: 'No centralized inventory', level: 1 },
          { text: 'Partial inventory — some applications documented', level: 2 },
          { text: 'Complete inventory with owners, but access policies vary by app', level: 3 },
          { text: 'Complete inventory with owners, tiered risk classification, and standardized access policies per tier', level: 4 },
        ],
      },
    ],
  },
  {
    id: 'session',
    label: 'Session Management',
    shortLabel: 'SES',
    weight: 1.0,
    description: 'How well do you protect active sessions after authentication?',
    attackScenarioIds: ['token-theft', 'mfa-fatigue'],
    questions: [
      {
        id: 'ses-1',
        text: 'What are your session lifetime and idle timeout settings?',
        answers: [
          { text: 'Default settings, never customized (or very long sessions — 30+ days)', level: 1 },
          { text: 'Customized but generous (7–14 day sessions)', level: 2 },
          { text: 'Short sessions (8–24 hours) with idle timeout (1–4 hours)', level: 3 },
          { text: 'Risk-based session lifetimes — shorter for sensitive apps, with continuous re-evaluation', level: 4 },
        ],
      },
      {
        id: 'ses-2',
        text: 'Do you have session anomaly detection (impossible travel, device change, IP change)?',
        answers: [
          { text: 'No session anomaly detection', level: 1 },
          { text: 'Basic impossible travel rules in SIEM, manual review', level: 2 },
          { text: 'Automated detection with alerts for impossible travel and new device logins', level: 3 },
          { text: 'Continuous Access Evaluation (CAE) — sessions re-evaluated throughout lifetime based on risk signals', level: 4 },
        ],
      },
      {
        id: 'ses-3',
        text: 'Can you revoke all sessions for a user across all SSO-connected applications?',
        answers: [
          { text: 'Can only revoke IdP session — downstream app sessions persist', level: 1 },
          { text: 'Can revoke IdP session and some app sessions manually', level: 2 },
          { text: 'Centralized session revocation for most apps with some exceptions', level: 3 },
          { text: 'Universal session revocation via CAEP/SSE integration — revoking IdP session kills all downstream sessions', level: 4 },
        ],
      },
    ],
  },
  {
    id: 'device',
    label: 'Device Trust & Posture',
    shortLabel: 'DEV',
    weight: 1.0,
    description: 'Do you verify device health before granting access?',
    attackScenarioIds: ['credential-phish', 'token-theft'],
    questions: [
      {
        id: 'dev-1',
        text: 'Do you enforce managed device requirements for authentication?',
        answers: [
          { text: 'No device requirements — any device can authenticate', level: 1 },
          { text: 'Device requirements for some applications or user groups', level: 2 },
          { text: 'Managed device required for all corporate apps, BYOD restricted to limited set', level: 3 },
          { text: 'Device trust with posture checks (OS version, encryption, EDR running) enforced at every authentication', level: 4 },
        ],
      },
      {
        id: 'dev-2',
        text: 'How do you handle BYOD (Bring Your Own Device) access?',
        answers: [
          { text: 'BYOD has same access as managed devices', level: 1 },
          { text: 'BYOD can access some apps with basic checks', level: 2 },
          { text: 'BYOD restricted to web-only access with limited app set, no admin functions', level: 3 },
          { text: 'BYOD goes through device posture assessment, gets limited access scope, with step-up auth for sensitive resources', level: 4 },
        ],
      },
      {
        id: 'dev-3',
        text: 'Is endpoint protection (EDR) status checked during authentication?',
        answers: [
          { text: 'No integration between EDR and identity provider', level: 1 },
          { text: 'EDR is deployed but not tied to authentication decisions', level: 2 },
          { text: 'EDR status checked at login — devices without EDR are blocked', level: 3 },
          { text: 'Real-time EDR signal integration — compromised devices are automatically blocked from authentication', level: 4 },
        ],
      },
    ],
  },
  {
    id: 'breakglass',
    label: 'Breakglass & Emergency Access',
    shortLabel: 'BRK',
    weight: 0.75,
    description: 'Do you have documented emergency access procedures?',
    attackScenarioIds: ['helpdesk-se'],
    questions: [
      {
        id: 'brk-1',
        text: 'Do you have break-glass (emergency access) accounts for your identity provider?',
        answers: [
          { text: 'No break-glass accounts — rely on regular admin accounts', level: 1 },
          { text: 'Break-glass accounts exist but credentials are known to multiple people', level: 2 },
          { text: 'Break-glass accounts with credentials stored securely (e.g., safe, vault), tested periodically', level: 3 },
          { text: 'Break-glass accounts with MFA, stored in physical/digital vault, usage alerts, tested quarterly, documented runbook', level: 4 },
        ],
      },
      {
        id: 'brk-2',
        text: 'Do you have documented emergency access procedures for critical applications?',
        answers: [
          { text: 'No documented procedures', level: 1 },
          { text: 'Some procedures exist but are outdated or incomplete', level: 2 },
          { text: 'Documented procedures for critical (Tier 1) applications, reviewed annually', level: 3 },
          { text: 'Comprehensive procedures for all tiered applications, tested semi-annually, with defined RTO and escalation paths', level: 4 },
        ],
      },
    ],
  },
  {
    id: 'lifecycle',
    label: 'Lifecycle & Offboarding',
    shortLabel: 'LCM',
    weight: 1.0,
    description: 'How quickly and thoroughly do you deprovision access?',
    attackScenarioIds: ['oauth-phish'],
    questions: [
      {
        id: 'lcm-1',
        text: 'How quickly is access revoked when an employee is terminated?',
        answers: [
          { text: 'Manual process — can take days or weeks', level: 1 },
          { text: 'Same-day revocation but manual, dependent on HR notification', level: 2 },
          { text: 'Automated IdP deprovisioning triggered by HR system within hours', level: 3 },
          { text: 'Real-time automated deprovisioning via SCIM + universal session revocation + OAuth token cleanup within minutes', level: 4 },
        ],
      },
      {
        id: 'lcm-2',
        text: 'Do you audit for orphaned accounts (accounts with no active owner)?',
        answers: [
          { text: 'No orphaned account detection', level: 1 },
          { text: 'Annual audit for orphaned accounts', level: 2 },
          { text: 'Quarterly automated reports identifying orphaned accounts', level: 3 },
          { text: 'Continuous monitoring with auto-disable for accounts unmatched to active employees + alerting', level: 4 },
        ],
      },
    ],
  },
];

// Maturity level definitions
const maturityLevels = [
  {
    level: 1,
    label: 'INITIAL',
    color: 'text-terminal-red',
    bgColor: 'bg-terminal-red/10',
    borderColor: 'border-terminal-red/30',
    description: 'Ad-hoc processes. No formal IAM controls. High risk of identity-based attacks.',
  },
  {
    level: 2,
    label: 'DEVELOPING',
    color: 'text-terminal-amber',
    bgColor: 'bg-terminal-amber/10',
    borderColor: 'border-terminal-amber/30',
    description: 'Some controls in place but inconsistent. Gaps exist in coverage and enforcement.',
  },
  {
    level: 3,
    label: 'DEFINED',
    color: 'text-terminal-cyan',
    bgColor: 'bg-terminal-cyan/10',
    borderColor: 'border-terminal-cyan/30',
    description: 'Standardized, documented processes. Consistent enforcement across the organization.',
  },
  {
    level: 4,
    label: 'OPTIMIZED',
    color: 'text-terminal-green',
    bgColor: 'bg-terminal-green/10',
    borderColor: 'border-terminal-green/30',
    description: 'Automated, continuously monitored, and improved. Industry-leading IAM posture.',
  },
];

export { assessmentCategories, maturityLevels };
