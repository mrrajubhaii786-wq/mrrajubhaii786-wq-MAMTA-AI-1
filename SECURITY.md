# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 7.3.x   | Yes |
| 7.2.x   | No (vulnerable) |
| < 7.2   | No |

## Reporting

Report vulnerabilities to: security@mamta.ai
DO NOT open public issues for security bugs.

## Measures

- AES-256-GCM encryption
- Firebase Auth JWT
- Rate limiting
- Input validation
- Helmet headers
- CSP policies
- Dependency audits

## Fixed in 7.3

- CR-001: Firestore rules open
- CR-002: API key exposed
- CR-003: Hardcoded salt
- CR-004: .gitignore dangerous
