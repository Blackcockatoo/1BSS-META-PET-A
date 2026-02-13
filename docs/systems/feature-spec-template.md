# Feature Spec Template (Practical, Minimal, Shippable)

Use this template to turn an idea into an implementation-ready spec quickly.

## Inputs to fill first
- `{FEATURE}`
- `{PROJECT_CONTEXT}`
- `{PLATFORM}`
- `{NON_NEGOTIABLES}`
- `{PRIVACY_POSTURE}` (`LOCAL_ONLY`, `MINIMAL_SHARE`, or `CLASSROOM_SAFE`)
- `{TIME}`

---

## 1) Goal + non-goals
Build `{FEATURE}` for `{PROJECT_CONTEXT}` on `{PLATFORM}` within `{TIME}`, delivering the smallest useful version that solves the core user problem end-to-end without regressing `{NON_NEGOTIABLES}`. The feature must honor `{PRIVACY_POSTURE}` by default (no surprise data sharing, explicit user intent for any export/sync). Non-goals for this iteration: advanced customization, broad integrations, and speculative scalability work not needed for current usage.

## 2) User stories (3–7)
- As a user, I can discover and start `{FEATURE}` from the main entry point in under 2 clicks.
- As a user, I can complete the primary action for `{FEATURE}` with clear success/failure feedback.
- As a returning user, I can resume or review prior `{FEATURE}` state (if retention policy allows).
- As a privacy-conscious user, I can understand what data is stored and how to clear it.
- As a user on a shared device, I can avoid exposing my prior activity unintentionally.
- As an operator/dev, I can verify feature correctness via deterministic acceptance tests.
- As product, we can roll out safely without breaking `{NON_NEGOTIABLES}`.

## 3) UX flow (steps + edge cases)
### Happy path
1. User lands on relevant page/screen.
2. User sees clear CTA for `{FEATURE}`.
3. User provides required input(s).
4. System validates input immediately.
5. User confirms action.
6. System processes and returns result state.
7. User sees success message + next best action (done, retry, export, etc.).

### Edge cases
- Missing/invalid input: inline validation, no destructive side effects.
- Interrupted flow (refresh/back/navigation): recover draft state or clean reset.
- Offline/slow network (if applicable): queue/retry pattern or explicit failure guidance.
- Duplicate submission/replay: idempotent handling, no duplicate records.
- Unauthorized/expired session: redirect to auth with state preservation when safe.
- Shared device mode: auto-clear sensitive UI state on logout/session end.

## 4) Data model (what is stored, where, retention)
### Entities
- `FeatureRecord`: core artifact for `{FEATURE}`.
- `FeatureEvent` (optional): append-only audit events for debug/analytics.

### Fields (minimum)
- `id`, `userId` (or anonymous/session key), `status`, `payload`, `createdAt`, `updatedAt`.
- Optional: `version`, `source`, `expiresAt`.

### Storage location
- `LOCAL_ONLY`: local storage/indexedDB only; no server persistence.
- `MINIMAL_SHARE`: server stores only required fields; avoid raw sensitive payloads.
- `CLASSROOM_SAFE`: redact PII; scoped per classroom/account.

### Retention
- Default retention: shortest practical window (e.g., 30–90 days or session-only).
- User controls: clear/reset action.
- Auto-purge job for expired data.

### Observability
- Log metadata only; never log raw sensitive content.

## 5) Security & abuse cases
### Tampering
- Validate all client inputs server-side.
- Sign/verify sensitive tokens; reject malformed payloads.

### Replay/duplicate actions
- Use idempotency keys per action submission.
- Expire action tokens quickly.

### Shared device leakage
- Require explicit user context; clear cached state on sign-out.
- Optional private mode with no persistent local storage.

### Privilege abuse
- Enforce authorization at every read/write path.

### Data exposure
- Minimize fields at rest.
- Redact secrets from logs.
- Encrypt at rest/in transit as applicable.

### Abuse throttling
- Rate-limit high-risk endpoints/actions.
- Add basic anomaly detection hooks for repeated failures.

## 6) Acceptance tests (Given/When/Then)
### Primary completion
- Given a valid user on `{PLATFORM}`
- When they complete the minimum required inputs and submit
- Then `{FEATURE}` succeeds and shows a clear success state.

### Validation
- Given missing/invalid required input
- When submit is attempted
- Then submission is blocked and inline errors are shown.

### Non-negotiable protection
- Given existing behavior covered by `{NON_NEGOTIABLES}`
- When `{FEATURE}` is enabled
- Then baseline behavior remains unchanged.

### Privacy posture
- Given `{PRIVACY_POSTURE}`
- When user completes `{FEATURE}`
- Then only allowed data is stored/shared per policy.

### Replay protection
- Given a repeated identical submission
- When replayed within a short window
- Then only one canonical result is persisted.

### Shared device safety
- Given user logs out on shared device
- When next user opens app
- Then prior `{FEATURE}` sensitive state is not visible.

### Failure handling
- Given transient processing/network failure
- When user retries
- Then system resolves once and does not duplicate side effects.

## 7) Implementation plan (files/modules + checklist)
### Likely modules to touch (adapt to your repo)
- `ui/{feature}/`: entry screen, form/input components, result state component.
- `lib/{feature}/service`: core business logic + validation.
- `api/{feature}` or `server/{feature}`: endpoint/handler, authz, idempotency.
- `data/{feature}`: model/schema + retention hooks.
- `analytics/{feature}`: event metadata only (privacy-safe).
- `tests/{feature}`: acceptance and regression coverage.

### Small task checklist
- [ ] Define scope, success metric, and non-goals for v1.
- [ ] Add minimal data schema (`FeatureRecord`) and migration (if server-backed).
- [ ] Implement happy-path UI and synchronous validation.
- [ ] Implement backend handler with authz + idempotency.
- [ ] Add privacy controls (storage minimization + clear/reset path).
- [ ] Add edge-case handling (network fail, duplicate submit, session expiry).
- [ ] Add acceptance tests for the core scenarios above.
- [ ] Run regression checks against `{NON_NEGOTIABLES}`.
- [ ] Ship behind feature flag (if available) and monitor.
