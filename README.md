# ⚔️ CipherLab

### Tactical Cryptography & File Integrity Workstation

<p align="center">
  <img src="https://img.shields.io/badge/PROJECT-CipherLab-64748b?style=for-the-badge&logo=proton&logoColor=white" alt="CipherLab project badge" />
  <img src="https://img.shields.io/badge/DOMAIN-Cryptography-84cc16?style=for-the-badge" alt="Cryptography badge" />
  <img src="https://img.shields.io/badge/PRIVACY-Local--First-16a34a?style=for-the-badge&logo=shield&logoColor=white" alt="Local-first badge" />
  <img src="https://img.shields.io/badge/STATUS-Under%20Development-f59e0b?style=for-the-badge" alt="Development status badge" />
</p>

<p align="center">
  <strong>A browser-based cryptographic operations laboratory for hashing, encoding, secure randomness, and file integrity verification.</strong>
</p>

<p align="center">
  <code>INSPECT</code> · <code>HASH</code> · <code>VERIFY</code> · <code>UNDERSTAND</code>
</p>

---

## 01 · Mission Brief

CipherLab is a browser-based cryptography and data-integrity toolkit designed to make cryptographic primitives observable, testable, and understandable through a tactical operations-console interface.

Rather than relying on simulated security telemetry or opaque API calls, the project aims to expose the underlying operations directly: bytes are encoded, digests are computed, files are hashed, and reference values are compared.

CipherLab is intended for **cybersecurity education, developer workflows, cryptographic experimentation, and integrity-checking demonstrations**.

> **Design principle:** The interface may look like an operations workstation; its outputs must remain technically honest.

### Operational objectives

- Provide practical utilities for standard cryptographic operations.
- Demonstrate the difference between hashing, encoding, and encryption.
- Enable local file hashing without uploading file contents to a server.
- Explain cryptographic behavior using reproducible inputs and outputs.
- Avoid fabricated metrics, simulated scan results, and unsupported security claims.

## 02 · Feature Matrix

| Module | Intended capability | Primary API or method |
|---|---|---|
| Hash Studio | SHA-256, SHA-384, SHA-512 digests | `crypto.subtle.digest()` |
| Encoding Lab | Text, hexadecimal, Base64, binary conversion | `TextEncoder`, `TextDecoder`, conversion utilities |
| Randomness Lab | Cryptographically secure random-byte generation | `crypto.getRandomValues()` |
| Integrity Checker | Local file hashing and reference-digest comparison | File API + Web Crypto |
| Avalanche Playground | Compare digests for changed inputs | Web Crypto + byte comparison |
| Cryptography Reference | Explain primitives and limitations | Reference documentation |
| Operation History | Session-level operation metadata | Application state |

**Implementation status:** The table describes the intended feature set. Mark individual modules as implemented only after validating the generated application.

## 03 · Technical Stack

The following is the intended stack; confirm it against the generated source before treating it as definitive.

<p>
  <img src="https://img.shields.io/badge/React-UI-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-Types-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-Styling-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Web%20Crypto-Platform%20API-475569?style=flat-square" alt="Web Crypto API" />
</p>

| Component | Responsibility |
|---|---|
| React | Component-driven user interface |
| TypeScript | Static type checking, where configured |
| Vite | Development server and production build, where configured |
| Tailwind CSS | Utility-based styling, where configured |
| Web Crypto API | Browser-native cryptographic primitives |
| File API | Read local files for integrity checks |
| TextEncoder / TextDecoder | UTF-8 byte conversion |

CipherLab does not require an AI model to perform its core cryptographic operations. Its intended local-first architecture also avoids a required application backend for these operations.

## 04 · Cryptographic Comparison

### Hash functions

A cryptographic hash maps input data of arbitrary length to a fixed-length digest. It is designed for integrity checks and other cryptographic applications—not reversible encryption.

| Property | SHA-256 | SHA-384 | SHA-512 |
|---|---:|---:|---:|
| Standard family | SHA-2 | SHA-2 | SHA-2 |
| Digest length | 256 bits | 384 bits | 512 bits |
| Digest length in bytes | 32 | 48 | 64 |
| Typical use | Integrity checks, signatures, identifiers | Applications requiring a longer digest | Integrity checks, signatures, applications requiring a longer digest |
| Browser API identifier | `SHA-256` | `SHA-384` | `SHA-512` |

These are fixed-output hash functions. They do not provide confidentiality, authentication, or proof that a file is trustworthy on their own.

### Hashing vs. encoding vs. encryption

| Property | Hashing | Encoding | Encryption |
|---|---|---|---|
| Primary purpose | Integrity and cryptographic processing | Data representation or transport | Confidentiality |
| Reversible by design? | No | Yes, if the encoding is known | Yes, with the appropriate key and algorithm |
| Requires a secret key? | Not for ordinary SHA-2 hashing | No | Typically yes for modern symmetric encryption |
| Example | SHA-256 | Base64 | AES-GCM |
| CipherLab scope | Core hashing modules | Conversion utilities | Educational explanation only unless separately implemented |

**Important:** Base64 is not encryption. A digest is not a password. A hash comparison is not a digital signature. These distinctions are fundamental to using cryptographic tools correctly.

### Security properties at a glance

| Property | Meaning | What CipherLab can demonstrate |
|---|---|---|
| Integrity comparison | Whether computed and reference digests match | Yes, when implemented and tested |
| Confidentiality | Preventing unauthorized disclosure | Not provided by hashing or encoding |
| Authenticity | Establishing who created or approved data | Not established by a plain digest |
| Collision resistance | Difficulty of finding distinct inputs with the same digest | Explained conceptually; not proven by a demo |
| Randomness quality | Suitability of generated values for security purposes | Uses browser cryptographic randomness when implemented correctly; visualizations cannot prove security |

## 05 · Architecture

### Intended processing pipeline

```text
┌───────────────────────────────────────────┐
│              User Interface               │
│  Hash Studio · Encoding · Integrity Lab   │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│            Input Validation                │
│   Text · Bytes · Hex · Base64 · File       │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│          Browser Processing Layer         │
│   Web Crypto API · File API · Utilities    │
└─────────────────────┬─────────────────────┘
                      │
                      ▼
┌───────────────────────────────────────────┐
│            Result Presentation             │
│  Digest · Conversion · Comparison · Status │
└───────────────────────────────────────────┘
```

This diagram describes the target architecture, not a verified source-code audit. Confirm actual module boundaries against the generated implementation.

### Processing boundaries

- **Text input:** Convert text into bytes using an explicit encoding, normally UTF-8.
- **Hashing:** Pass bytes to `crypto.subtle.digest()` and format the returned digest for display.
- **File integrity:** Read a selected file locally and hash its bytes without sending the file to a remote service.
- **Digest comparison:** Validate the supplied reference format before comparing normalized digest values.
- **Operation history:** Store only necessary session metadata; do not retain raw inputs, secret material, or file contents.

### Browser requirements

Web Crypto operations such as `crypto.subtle.digest()` generally require a secure context. HTTPS and trusted local development origins are the usual deployment choices.

Actual support depends on the browser and environment. Feature detection and clear error messages should be implemented rather than assuming every API is available.

## 06 · Integrity Verification Protocol

The Integrity Checker should follow a deterministic process:

1. Accept a user-selected local file.
2. Read its bytes in the browser.
3. Compute a digest using the selected supported hash algorithm.
4. Accept a reference digest from a trusted source.
5. Validate the reference digest's hexadecimal representation and expected length.
6. Normalize the reference value and compare it with the computed digest.
7. Report the result without implying more than the comparison establishes.

### Expected result states

| State | Meaning |
|---|---|
| `MATCH` | Computed and reference digests are equal |
| `MISMATCH` | Both digests are valid, but differ |
| `AWAITING REFERENCE HASH` | No reference digest has been provided |
| `INVALID REFERENCE HASH` | The supplied digest fails validation |
| `PROCESSING ERROR` | The file could not be read or the operation failed |

A match means the computed digest equals the supplied reference. It does **not** establish that the reference digest came from a trusted publisher, that the file is safe to execute, or that the source itself was uncompromised.

For large files, implementations should consider memory use and responsiveness. The standard Web Crypto `digest()` interface accepts a complete input buffer rather than providing a general streaming-digest interface.

## 07 · Randomness Lab

The intended Randomness Lab uses `crypto.getRandomValues()` to generate cryptographically strong random bytes within the browser's supported limits.

Potential output representations:

- Hexadecimal
- Base64
- Binary

If a histogram is included, it should be calculated from actual generated sample data, with the sample size and method clearly identified.

**Interpretation limit:** A histogram can reveal some distribution patterns, but it cannot establish that a generator is cryptographically secure. Do not use `Math.random()` as a replacement for cryptographic randomness.

Random output should not be presented as a password-management system, key-management solution, or proof of security.

## 08 · Validation & Test Methodology

Cryptographic utilities need reproducible tests, not just a visually convincing interface.

### SHA-256 known-answer test

For the ASCII string `abc`, the expected SHA-256 digest is:

```text
ba7816bf8f01cfea414140de5dae2223
b00361a396177a9cb410ff61f20015ad
```

This is a standard known-answer test vector. The implementation should match the complete 64-character hexadecimal value, case-insensitively.

### Required test categories

| Test category | Example | Expected behavior |
|---|---|---|
| Known-answer test | SHA-256 of `abc` | Exact digest match |
| Empty input | Empty text string | Valid digest of empty bytes |
| Unicode | Text containing non-ASCII characters | Consistent UTF-8 conversion |
| Encoding round trip | Text → Base64 → text | Original text recovered |
| Hex validation | Odd-length or invalid hexadecimal | Clear validation error |
| Base64 validation | Malformed encoded input | Reject or clearly report invalid input |
| File integrity | Same file and same reference digest | `MATCH` |
| Modified file | Different bytes | `MISMATCH`, assuming valid reference |
| Reference validation | Wrong digest length or invalid characters | `INVALID REFERENCE HASH` |
| API failure | Unsupported API or rejected operation | Graceful error state |
| History privacy | Process a sensitive input | Raw input not persisted in history |

### Recommended independent checks

- Compare digests with a trusted, independent implementation such as OpenSSL.
- Test empty input, Unicode, large inputs, and binary files.
- Verify that the UI displays the correct number of digest bytes.
- Test all result states rather than only successful operations.
- Confirm that no network request sends local file contents to a server.
- Run the project's unit tests and production build before release.

Tests should be automated where practical. Do not label a test suite as passing until it has actually been executed.

## 09 · Threat Model & Security Boundaries

### Intended protections

| Concern | Intended mitigation | Remaining limitation |
|---|---|---|
| Accidental file disclosure | Local file processing without required upload | Browser extensions, compromised devices, and future code changes remain relevant |
| Misleading verification | Explicit reference-digest comparison states | An untrusted reference digest can mislead users |
| Invalid input | Format validation and error handling | Validation must be implemented and tested |
| Sensitive operation history | Store metadata rather than raw content | Browser memory and other application state still require review |
| Fake security indicators | Display only measured application state | UI accuracy depends on correct instrumentation |
| Unsupported browser APIs | Feature detection and visible errors | Availability differs by browser and context |

### Out of scope

CipherLab is not designed to provide:

- Malware detection or antivirus protection.
- Endpoint monitoring or security incident response.
- Digital-signature verification unless separately implemented.
- Key storage, key custody, or secrets management.
- Formal proof of cryptographic security.
- Protection against a compromised operating system or browser.
- Certification for military, government, or high-assurance use.

### Security disclosure

If you discover a security issue, avoid publishing sensitive exploit details or private information in a public issue. Use a responsible disclosure channel once one has been configured for the project.

## 10 · User Interface & Design System

CipherLab's intended visual language is inspired by technical operations consoles.

| Element | Design direction |
|---|---|
| Primary surfaces | Near-black and charcoal |
| Secondary surfaces | Muted olive and graphite |
| Accent | Controlled green |
| Warning / validation | Amber |
| Typography | Monospaced text for hashes, identifiers, and telemetry |
| Layout | Structured panels, clear status labels, compact technical tables |
| Interaction | Keyboard-accessible controls and visible focus states |

The aesthetic is a presentation choice, not a claim of military affiliation or certification.

## 11 · Installation & Development

### Prerequisites

- A compatible Node.js version
- npm, if the project uses npm
- A modern browser supporting the required Web Crypto APIs

### Local setup

```bash
git clone https://github.com/DSaranyo/CipherLab.git
cd CipherLab
npm install
npm run dev
```

Open the local URL printed by the development server.

> These commands assume the generated project uses Vite and npm. Verify `package.json` and use the actual package manager and scripts supplied by the project.

### Production build

For a Vite-based project:

```bash
npm run build
npm run preview
```

Run the project's available test command as well. If no test suite exists yet, add one before claiming automated test coverage.

## 12 · Repository Structure

An example organization for a modular implementation:

```text
CipherLab/
├── public/
├── src/
│   ├── components/
│   ├── modules/
│   │   ├── hash-studio/
│   │   ├── encoding-lab/
│   │   ├── randomness-lab/
│   │   ├── integrity-checker/
│   │   └── avalanche-playground/
│   ├── lib/
│   │   ├── crypto/
│   │   ├── encoding/
│   │   └── validation/
│   ├── tests/
│   ├── App.tsx
│   └── main.tsx
├── README.md
├── package.json
└── LICENSE
```

This is a suggested structure, not a claim about the current repository. Adapt it to the source files actually generated.

## 13 · Roadmap

- [ ] Validate the complete hashing and encoding workflows.
- [ ] Implement and test all integrity-checker result states.
- [ ] Verify local-only file processing.
- [ ] Add automated known-answer tests.
- [ ] Add input validation and accessible error states.
- [ ] Document browser compatibility and large-file behavior.
- [ ] Add screenshots of the actual application.
- [ ] Publish a live demo after deployment review.
- [ ] Select and add an appropriate open-source license.
- [ ] Review dependencies and security assumptions before release.

## 14 · Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a focused feature branch.
3. Keep cryptographic behavior separate from presentation logic where practical.
4. Include tests for changes to hashing, encoding, or integrity verification.
5. Document any new security assumptions or limitations.
6. Open a pull request with a concise description and reproducible validation steps.

Do not submit fake telemetry, unsupported security claims, or untested cryptographic implementations as production-ready functionality.

## 15 · References

- [MDN: Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [MDN: `SubtleCrypto.digest()`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest)
- [MDN: `Crypto.getRandomValues()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues)
- [NIST FIPS 180-4: Secure Hash Standard](https://csrc.nist.gov/pubs/fips/180-4/upd1/final)
- [NIST Cryptographic Standards and Guidelines](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)

## 16 · Author

**Saranyo Deyasi**  
GitHub: [@DSaranyo](https://github.com/DSaranyo)

Built as a technical learning project focused on cryptography, browser security, and transparent implementation.

---

<p align="center">
  <strong>Understand the primitive. Verify the output. Trust the evidence.</strong>
</p>

<p align="center">
  <sub>CipherLab is an educational project and is not affiliated with or certified by any military, intelligence agency, or government organization.</sub>
</p>
