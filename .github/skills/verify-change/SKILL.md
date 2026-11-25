---
name: verify-change
description: Verify scoped TypeScript changes against acceptance criteria, tests and regression risks.
---

Identify each acceptance criterion. Inspect the corresponding tests and implementation. If execution tools are available, run `npm run typecheck` and `npm test`. Otherwise report what is unverified. Return criterion-by-criterion evidence and unresolved findings.
