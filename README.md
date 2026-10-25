# CIPHERLAB
### Tactical Cryptographic Operations Workstation
> *Cryptography, made observable.*

CipherLab is a client-side cryptographic analysis, data transformation, and file integrity workstation designed with a military cyber operations aesthetic. It provides real-time, mathematically grounded cryptographic tooling for security engineers, developers, and researchers.

---

## Core Principles & Security Constraints

1. **Pure Client-Side Execution**: All cryptographic algorithms (SHA-256, SHA-384, SHA-512) and random byte generation are executed entirely inside your web browser via standard W3C Web Cryptography APIs (`crypto.subtle.digest`, `crypto.getRandomValues`).
2. **Zero Remote Data Transmission**: Your plaintexts, files, keys, and digests are never sent over the network. Network activity is completely unneeded for core operations.
3. **No AI API Dependency**: No machine learning models, remote LLM endpoints, or cloud backends are invoked at runtime.
4. **Zero-Persistence Audit Logging**: The workstation maintains an ephemeral in-memory session audit trail strictly during the lifetime of your browser tab. Original plaintexts, secrets, and payloads are never recorded.
5. **Authentic Cryptographic Operations**: Every calculation is real and verifiable against official NIST FIPS 180-4 and RFC 4648 test vectors. No simulated metrics or fake threat intelligence.

---

## Functional Modules

### 1. Mission Overview
- **Session Telemetry**: Real-time counters and last-operation status derived strictly from current session activity.
- **Runtime Environment Inspector**: Live checks on W3C WebCrypto API availability, hardware CSPRNG status, and sandbox isolation.
- **Rapid Navigation**: One-click operational shortcuts to all active tools.

### 2. Hash Studio
- **Supported Standards**: SHA-256 (256-bit / 32-byte), SHA-384 (384-bit / 48-byte), SHA-512 (512-bit / 64-byte).
- **Buffer Inspector**: Live character count and multibyte UTF-8 byte stream metrics.
- **Pre-configured Test Vectors**: NIST canonical vectors ("abc", empty string, Pangram).
- **Reference Checksum Matcher**: Direct comparison with external vendor hashes including length validation and mismatch detection.
- **Export Affordances**: Copy hexadecimal digest to clipboard or download as `.txt`.

### 3. Encoding Lab
- **Representations**: Lossless bidirectional conversion between **UTF-8 Text**, **Hexadecimal (Base-16)**, **Base64 (RFC 4648)**, and **Binary (8-bit octet strings)**.
- **Validation**: Strict validation of hex nibbles (pair count and character set) and Base64 padding.
- **Unicode Safety**: Standard `TextEncoder` and `TextDecoder` handling for international scripts and emojis.
- **Educational Distinction**: Clear breakdown illustrating why encoding is reversible representation, whereas encryption requires a secret key.

### 4. Randomness Lab
- **Entropy Source**: Hardware-backed CSPRNG (`window.crypto.getRandomValues`) with safe chunking for arbitrary sample sizes.
- **Key Presets**: 16 Bytes (128-bit), 32 Bytes (256-bit), 64 Bytes (512-bit), 128 Bytes (1024-bit), 256 Bytes (2048-bit).
- **Output Encodings**: Hexadecimal, Base64, Spaced 8-bit Binary, and Byte Array notation.
- **Real Sample Distribution Histogram**: 16-bin frequency histogram calculated directly from the active sample with sample mean and sampling variation explanations.
- **Exporting**: Download raw sample as a binary `.bin` file or copy to clipboard.

### 5. Integrity Checker
- **Drag-and-Drop File Ingestion**: Ingests files directly via browser File API without uploading.
- **Multi-Algorithm Hashing**: Computes SHA-256, SHA-384, or SHA-512 over raw file byte arrays.
- **Vendor Reference Verification**: Verifies against reference digests with four distinct statuses: `MATCH`, `MISMATCH`, `AWAITING REFERENCE HASH`, and `INVALID REFERENCE HASH`.
- **GNU Checksum Generation**: Download standard `.sha256` / `.sha512` checksum files (`<hash>  <filename>`).

### 6. Crypto Playground
- **Dual-Input Avalanche Inspector**: Side-by-side stream comparison (Stream A vs Stream B).
- **Character-Aligned Diff Matrix**: Visual highlighting of matching vs diverging hexadecimal nibbles.
- **Statistical Dispersion Metric**: Shows exact changed characters and percentage difference.
- **Pre-loaded Demonstrations**: Single-bit flips (e.g. `hello` vs `Hello`), character appends, and single-letter sentence substitutions.
- **Theoretical Modules**: Strict Avalanche Criterion (SAC), Collision Resistance, Preimage Resistance, and Digest Entropy.

### 7. Cryptography Concepts
- Searchable reference encyclopedia covering:
  - Cryptographic Hash Functions
  - Symmetric Key Encryption (AES-GCM, Block Ciphers)
  - Asymmetric Cryptography (RSA, ECC)
  - Digital Signatures (ECDSA, Ed25519)
  - Key Derivation Functions (Argon2, bcrypt, PBKDF2)
  - CSPRNG vs Standard PRNG
  - Encoding vs Encryption
  - File Integrity & Authenticity
- Clear indicators of which primitives are implemented in the workstation vs theoretical reference.

### 8. Operation History
- Ephemeral in-memory transaction audit log.
- Records non-sensitive metadata: timestamps, operation types, algorithms, duration, and output sizes.
- Filter by category (Hashing, Encoding, Randomness, Integrity, Diff).
- Export complete audit reports as **JSON** or **CSV**.
- Instant memory purge action.

### 9. Cryptographic Self-Test Suite
- In-browser real-time execution of automated verification assertions against official NIST FIPS 180-4 and RFC 4648 test vectors. Accessible via the top bar `SELF-TEST` action.

---

## Project Structure

```text
src/
├── app/ or App.tsx           # Main application router and state coordinator
├── components/
│   ├── AppShell.tsx          # Responsive tactical workstation frame
│   ├── TopBar.tsx            # Top bar contract (insignia, breadcrumb, actions)
│   ├── Sidebar.tsx           # Fixed 240px navigation rail with Lucide icons
│   ├── Footer.tsx            # Operational status, reset action, project notice
│   ├── DataPanel.tsx         # Reusable tactical panel with 1px border (#28342D)
│   ├── CopyButton.tsx        # Clipboard action with visual feedback
│   ├── DownloadButton.tsx    # File export (.txt, .bin, .sha256, .json, .csv)
│   ├── StatusIndicator.tsx   # Text-based status badge (nominal, active, warning, alert)
│   ├── TestSuiteModal.tsx    # In-browser automated NIST verification runner
│   └── InfoModal.tsx         # Architecture and security guarantee documentation
├── hooks/
│   └── useOperationHistory.ts # In-memory session store with JSON/CSV export
├── lib/
│   ├── crypto.ts             # WebCrypto subtle.digest(), diff analysis, algorithm metadata
│   ├── encoding.ts           # Lossless UTF-8, Hex, Base64, Binary transformations
│   ├── random.ts             # CSPRNG byte generator and 16-bin frequency histogram
│   ├── file-integrity.ts     # Browser File API hashing and checksum verification
│   ├── test-vectors.ts       # NIST FIPS 180-4 test vectors and automated test suite
│   └── concepts-data.ts      # Educational encyclopedia database
├── modules/
│   ├── overview/             # Mission Overview dashboard
│   ├── hash-studio/          # 3-part cryptographic hashing workspace
│   ├── encoding-lab/         # Multi-format representation converter
│   ├── randomness-lab/       # CSPRNG generator & sample histogram visualizer
│   ├── integrity-checker/    # Local file verification & checksum generation
│   ├── crypto-playground/    # Dual-input avalanche effect simulator
│   ├── concepts/             # Searchable cryptography encyclopedia
│   └── operation-history/    # Ephemeral session audit trail & export
├── styles/
│   └── index.css             # Tactical dark palette CSS variables and grid
└── types/
    └── index.ts              # Strict TypeScript definitions
tests/
└── crypto.test.ts            # Node.js automated CLI unit test suite
```

---

## Local Development Instructions

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm 9+

### Installation & Execution
```bash
# Clone the repository and enter directory
cd applet

# Install dependencies
npm install

# Run automated cryptographic unit tests (11 assertions)
npm test

# Verify TypeScript compilation and lint
npm run lint

# Start local development server (port 3000)
npm run dev

# Build for production deployment
npm run build
```

---

## Design System Specifications
- **Tactical Dark Palette**:
  - Primary Background: `#080B0A`
  - Secondary Background: `#0D1210`
  - Panel Background: `#111815`
  - Elevated Surface: `#17201B`
  - Primary Tactical Green: `#A3B18A`
  - Muted Olive: `#667653`
  - Phosphor Green: `#B7F397`
  - Amber Warning: `#E5AE54`
  - Critical Red: `#E05D5D`
  - Borders: `#28342D`
- **Typography**:
  - Interface Headings & Navigation: `Plus Jakarta Sans` / System Sans
  - Hashes, Hex, Byte Stream, Terminal Data: `JetBrains Mono` with tabular numerals (`tabular-nums`)

---

## License & Attribution
Distributed under the Apache 2.0 License. Developed as an independent cybersecurity learning project. Not affiliated with or certified by any military or defense agency.
