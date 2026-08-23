# Project Problems — Current State

### 10. Known vulnerable transitive dependencies — ⚠️ REMAINING
`npm audit` still reports 52 vulnerabilities (4 critical, 27 high) in dev/CLI transitive deps
(`@remix-run/*`, `@xmldom/xmldom`, `@babel/core`). Fixing them requires a breaking `expo@57`
upgrade and is out of scope for this pass. Defer to an explicit Expo upgrade.

- **No tests** — ⚠️ REMAINING: there is still no test suite or test setup.

## Remaining

1. **Vulnerable transitive dependencies (#10)** — requires a breaking Expo upgrade (`expo@57`), not `npm audit fix --force`.
2. **No test suite** — no unit/integration tests or test runner configured.
