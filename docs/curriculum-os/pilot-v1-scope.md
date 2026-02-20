# Pilot v1 Scope Freeze (Day 1)

**Status:** Frozen for pilot delivery sprint  
**Owner:** Pilot Delivery Lead  
**Date frozen:** 2026-02-20

## Goal
Ship a classroom-safe, ICT-verifiable pilot build that can run a 20-minute session with no network dependency, no account setup, and no pet-state loss.

## In scope (Pilot v1)

### 1) Classroom Mode (non-negotiable)
- Single toggle to activate classroom defaults.
- Fast-start flow (minimal setup clicks before first interaction).
- Predictable session pacing for 20-minute lessons.
- Calm interaction loop (reduced UI clutter and interruptions).

### 2) Offline verification (non-negotiable)
- Visible `Offline Verified` state in product UI.
- Built-in self-check page confirming offline operation readiness.
- ICT-facing verification notes (DevTools and firewall checks) included in docs.

### 3) Teacher controls (non-negotiable)
- Reset pet.
- Pause/sleep mode.
- End session ritual.
- Volume/mute control.
- Brightness-friendly display mode.

### 4) Device robustness (non-negotiable)
- Runs on common school environments (older laptops, Chromebooks, iPads where supported).
- No account required.
- No network login gate.

### 5) Save/recovery reliability (non-negotiable)
- Pet state survives close/reopen.
- Corrupt or invalid state is detected and recovered safely.
- Clear `restart without loss` path for teachers.

## Out of scope (Pilot v1)
- App store listing and app-store compliance packaging.
- Expanded marketing site/press kit polish.
- Regulator pack publication.
- Advanced projector mode enhancements beyond baseline readability.
- Extended analytics/reporting features.

## Start-pass criteria (go/no-go before students enter)
A session should **not** start unless all checks pass:

1. Classroom Mode can be enabled and remains active.
2. `Offline Verified` indicator is visible.
3. Offline self-check returns ready/pass state.
4. Teacher controls are present (reset, pause/sleep, end session, volume/mute).
5. Last-known pet state loads successfully on launch.

## Must-pass release criteria (Day 1 freeze)
The pilot build is **not** releasable unless all items pass:

1. **Classroom Mode stability**
   - Can be enabled in-app and remains active through session.
   - Session can begin in under 60 seconds from launch on reference devices.

2. **Offline Verified + self-check**
   - `Offline Verified` state is visible in normal teacher flow.
   - Self-check completes and reports expected offline readiness.

3. **No pet-state loss on save/recovery**
   - Pet state remains intact after app restart.
   - Recovery flow preserves previous valid state after interrupted save/corrupt payload simulation.

## Test protocol (must be executed before pilot release)
Run these checks and store evidence in the pilot folder:

1. **Startup readiness test (x3 runs)**
   - Launch app, enable Classroom Mode, verify `Offline Verified`, run self-check.
   - Pass if all five start-pass criteria are true in all 3 runs.

2. **20-minute classroom timing test (x2 runs)**
   - Start session from launch and complete end-session ritual.
   - Pass if first interaction starts in <60 seconds and session completes without control loss.

3. **Save/recovery resilience test (x3 scenarios)**
   - Scenario A: normal close/reopen.
   - Scenario B: interrupted close during active session.
   - Scenario C: invalid/corrupt saved payload simulation.
   - Pass if last valid pet state is preserved in all scenarios.

4. **Offline validation test (x1 with ICT observer)**
   - Demonstrate self-check + provide DevTools/firewall verification flow.
   - Pass if ICT confirms no required outbound network dependency.

## Run + debug + test + screenshot evidence standard
Every pilot candidate build must include a single evidence bundle with four artifacts:

1. **Run evidence**
   - Command used to launch: `npm run dev`.
   - Record app URL, launch timestamp, and device profile.

2. **Debug evidence**
   - Record any warnings/errors observed during launch/session.
   - For each issue: symptom, reproduction step, resolution, retest result.

3. **Test evidence**
   - Attach completed test protocol results (run counts + pass/fail).
   - Include command outputs for lint/test checks.

4. **Screenshot evidence**
   - Capture at minimum:
     - Classroom Mode active state
     - `Offline Verified` visible state
     - End Session confirmation state
   - Save files with timestamp and device label.

## Acceptance evidence required
- Test notes for launch/session/restart on at least one low-spec device profile.
- Screenshot of `Offline Verified` state.
- Recovery test log showing `restart without loss` path.

## Change control
Any scope additions during Pilot v1 require:
1. Written rationale.
2. Risk assessment (time/stability impact).
3. Explicit sign-off from pilot owner.
