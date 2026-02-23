# MOSS60 Protocol v1

## 1) Payload grammar

All scanner/generator payloads SHOULD be wrapped in a versioned envelope.

```abnf
moss60-envelope = json-object
json-object = {
  "protocol": "moss60",
  "version": "1.0",
  "capabilities": [ capability, *capability ],
  "format": encoding-format,
  "payload": encoded-payload,
  "hash": moss60-hash,
  "createdAt": unix-ms
}

capability =
  "envelope-v1" /
  "qr-scan-v1" /
  "qr-generate-v1" /
  "encoding-base60" /
  "encoding-hex" /
  "encoding-json" /
  "encoding-text"

encoding-format = "base60" / "hex" / "json" / "text"
```

## 2) Encoding/decoding

1. Sender chooses `format` (`base60`, `hex`, `json`, `text`).
2. Sender encodes cleartext into `payload` based on that format.
3. Sender computes `hash = moss60Hash(cleartext)`.
4. Sender emits JSON envelope.
5. Receiver parses JSON envelope.
6. Receiver validates `version` and required capabilities.
7. Receiver decodes `payload` according to `format`.
8. Receiver may verify hash (`moss60Hash(decoded) === hash`).

Legacy support: payloads that are not envelopes may still be interpreted as raw `MOSS60:`, JSON, hex, or text.

## 3) Key exchange flow

1. **Key generation**: each peer derives a 60-slot private spiral from `extendedHash(seed, 8)` and exports a public hash.
2. **Exchange**: each peer shares public hash through QR or side-channel.
3. **Shared secret**: each peer computes `computeSharedSecret(myPrivate, theirPublic)`.
4. **Derivation**: shared secret is expanded with `extendedHash(secret, 16)` into:
   - encryption key (first 64 chars)
   - decryption key (next 64 chars)
5. **Messaging**: peers encrypt/decrypt messages with selected mode (`standard`/`temporal`).

## 4) Error semantics

Errors should be explicit and non-silent.

- `Unsupported protocol version: <version>`: envelope version mismatch.
- `Missing required capability: <capability>`: envelope lacks negotiation minima.
- `Invalid base-60 character: <char>`: malformed base60 payload.
- `Error decoding: ...`: scan/manual decode failed; payload must not be treated as valid.

Receivers SHOULD fail closed for envelope validation errors and must not silently reinterpret invalid envelopes as legacy payloads.

## 5) Version/capability negotiation

For v1, receivers require all of:

- `envelope-v1`
- `qr-scan-v1`
- `qr-generate-v1`

And expect one encoding capability matching `format`.

Negotiation rule:

- If `version !== 1.0` -> reject as incompatible.
- If any required capability is missing -> reject as incompatible.
- If compatible -> decode according to advertised format capability.

This prevents silent incompatibility between scanner and generator implementations.
