# QR Messaging Security Notes (Threat Model)

## What is guaranteed

- **Tamper-evident payload checks:** QR payloads can include hashes so edits are detectable during validation.
- **Format integrity:** MOSS60 encoding keeps payload structure compact and consistent across generate/scan paths.
- **Application-layer message obfuscation:** Messages use derived keys and XOR stream processing to reduce plaintext exposure in transit.

## What is **not** guaranteed

- **Not quantum-resistant cryptography:** The current MOSS60 hashing/key routines are custom and should not be treated as post-quantum security.
- **Not equivalent to audited modern protocols:** This is not a replacement for reviewed standards like TLS 1.3 + established E2EE protocols.
- **No automatic identity trust:** Public hash exchange must be verified out-of-band to reduce impersonation risk.
- **No endpoint hardening:** If a device/browser is compromised, message confidentiality and integrity can still fail.

## Operational guidance

- Verify peer identity over a second channel before trusting exchanged public hashes.
- Treat this channel as **integrity-oriented experimental messaging**, not high-assurance secure communications.
- For production-sensitive data, layer transport security and audited cryptographic protocols.
