# Pilot v1 Internal Runbook (1-page)

Use this runbook to execute the school pilot safely and consistently.

## 1. Before session (5 minutes)
- Launch latest frozen Pilot v1 build.
- Turn on **Classroom Mode**.
- Confirm **Offline Verified** indicator is visible.
- Run self-check once and confirm status shows ready.
- Set teacher controls baseline:
  - volume/mute
  - brightness-friendly mode
  - pause/sleep available

## 2. Session start (minute 0-2)
- Introduce activity and set expectation: calm 20-minute loop.
- Confirm no student account/login is needed.
- Start first interaction within 60 seconds of launch.

## 3. During session (minute 2-18)
- Keep pace using predictable interaction loop.
- If attention spikes, use pause/sleep mode to reset room.
- If UI/audio disrupts classroom, apply teacher controls immediately.

## 4. End session ritual (minute 18-20)
- Trigger **End Session** flow.
- Confirm pet state saved successfully.
- Tell class what carries into next session.

## 5. Failure handling (if something goes wrong)

### A) App appears frozen or unstable
1. Pause session and reassure class.
2. Use safe restart path.
3. Re-open and confirm prior pet state loaded.

### B) Save failure warning appears
1. Stop new interactions.
2. Trigger `restart without loss` flow.
3. Verify last valid state restored.

### C) ICT asks for network proof during session
1. Open Offline Verified view.
2. Run self-check.
3. Hand ICT the Network Audit Quickstart doc for DevTools/firewall confirmation.

## 6. After session (3 minutes)
- Log quick notes:
  - what worked
  - any friction moments
  - any recovery event triggered
- Record pass/fail against must-pass criteria:
  - Classroom Mode stable
  - Offline Verified + self-check visible/working
  - Save/recovery preserved state

## 7. Escalation rules
Escalate before next class if any are true:
- Offline Verified state is missing.
- Self-check fails.
- Pet state loss occurs or cannot be confirmed.
- Teacher controls unavailable.

**Escalation package:** timestamp, device type, action taken, screenshot (if possible), and short symptom summary.
