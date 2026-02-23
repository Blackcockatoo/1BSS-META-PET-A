# QR Messaging Threat Model

## Scope

This document defines security guarantees for the QR messaging subsystem in two operating modes:

- `secure`: standards-based cryptography via Web Crypto (`ECDH P-256` + `AES-GCM-256` envelope).
- `experimental`: deterministic MOSS60 primitives used for research and visual identity experiments.

The MOSS60 hash/glyph system remains part of deterministic identity and visualization and should not be treated as a sole high-assurance confidentiality mechanism.

## Guarantee Matrix

| Property | `secure` mode | `experimental` mode |
|---|---|---|
| Confidentiality | **Strong** when Web Crypto is available and keys are handled correctly (`AES-GCM-256`). | **Limited/experimental** (XOR stream based on MOSS60-derived material). |
| Integrity of encrypted payload | **Strong** (`AES-GCM` authentication tag). | **Weak to moderate** depending on usage; no modern AEAD envelope. |
| Forward compatibility | **Versioned envelope (`v=1`)** allows non-breaking crypto evolution. | No explicit versioned cryptographic envelope. |
| Interoperability | Built on standard primitives common across modern runtimes. | Custom algorithm, not interoperable with standard tooling. |
| Identity determinism / glyph reproducibility | Maintained through MOSS60 deterministic hash and glyph logic. | Native behavior. |
| Runtime dependency | Requires `crypto.subtle` support. | Can run in fallback environments without `crypto.subtle`. |

## Threat Notes

- Mode selection is explicit in store/config and defaults to `secure` when available.
- Guardrails prevent selecting experimental temporal/ratchet variants while in `secure` mode.
- If secure primitives are unavailable, runtime falls back to `experimental` mode with warnings.
