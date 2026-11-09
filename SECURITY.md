# Security Policy — Eslam Medical Assistant

## Current product status

**Demo/research only. Do not enter real patient data or use this application to diagnose, prescribe, or make treatment decisions.** The current implementation includes simulated profiles and AI-generated clinical/dosage content; it is not a verified electronic health record or a clinically validated decision-support system.

## Reporting

Report security issues privately through GitHub's private vulnerability reporting feature. Never post patient information, credentials, or exploit details in public issues.

## Mandatory controls before patient use

- Real authentication, MFA, role-based access and session revocation; demo profiles must not be treated as identities.
- Secure server-side data storage, tenant isolation, encryption in transit/at rest, access logs, consent, retention, export and deletion workflows.
- Clinical validation of all dosage, prescription and interaction content with source provenance, age/weight/renal/hepatic checks and clinician sign-off.
- Clear uncertainty handling, emergency escalation and no fabricated claim of verified medical evidence.
- Privacy, legal and regulatory review in every country where the product is offered.
- Threat modelling, penetration testing, dependency/secret scanning, backup/restore tests and incident response.

This policy is not a certification or approval for clinical deployment.
