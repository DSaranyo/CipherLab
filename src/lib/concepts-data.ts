import { ConceptItem } from '../types';

export const CRYPTO_CONCEPTS: ConceptItem[] = [
  {
    id: 'hash-functions',
    title: 'Cryptographic Hash Functions',
    category: 'Hashing',
    summary: 'One-way deterministic mathematical algorithms that map arbitrary-size binary inputs into fixed-size digest strings.',
    details: [
      'Deterministic: Computing the hash of the exact same data always yields the exact same digest.',
      'Preimage Resistance: Given digest H, it is computationally infeasible to find any original message m such that hash(m) = H.',
      'Second Preimage Resistance: Given message m1, it is computationally infeasible to find a distinct message m2 such that hash(m1) = hash(m2).',
      'Collision Resistance: It is computationally infeasible to find any two different messages m1 ≠ m2 such that hash(m1) = hash(m2).',
      'Avalanche Effect: Changing even a single bit in the input radically alters approximately 50% of the output digest bits in an unpredictable manner.'
    ],
    inCipherLab: 'Implemented via native browser Web Crypto subtle.digest() supporting SHA-256 (32 bytes), SHA-384 (48 bytes), and SHA-512 (64 bytes).',
    securityConsideration: 'Hashing alone is NOT encryption (it cannot be reversed). Unsalted SHA-256 must NOT be used for password storage; dedicated password-hashing functions (Argon2, bcrypt, PBKDF2 with high iterations) are required to resist GPU rainbow table attacks.'
  },
  {
    id: 'encoding-vs-encryption',
    title: 'Encoding vs. Encryption vs. Hashing',
    category: 'Encryption',
    summary: 'A fundamental distinction in computer science that is frequently confused in novice security implementations.',
    details: [
      'Encoding (Reversible Representation): Transforms data into another format for storage or transmission across channels (e.g. Base64 for 8-bit clean transport, Hexadecimal for human-readable binary). Requires NO secret key. ANYONE can decode it instantly.',
      'Encryption (Confidentiality with Key): Transforms plaintext into ciphertext using a mathematical algorithm and a secret cryptographic key. Reversible ONLY by holders of the appropriate decryption key.',
      'Hashing (One-Way Fingerprint): Maps data to a fixed-length mathematical digest. Irreversible by design. No key required (unlike HMAC).'
    ],
    inCipherLab: 'Encoding Lab allows instant lossless bidirectional conversion between UTF-8, Hex, Base64, and Binary.',
    securityConsideration: 'Encoding provides ZERO security or confidentiality. Never treat Base64, URL encoding, or Hex as a mechanism to protect secrets or tokens.'
  },
  {
    id: 'csprng',
    title: 'Cryptographically Secure Random Number Generation (CSPRNG)',
    category: 'Randomness',
    summary: 'Generators designed to produce pseudorandom sequences with unpredictable entropy sufficient for cryptographic keys, nonces, and initialization vectors.',
    details: [
      'Standard PRNGs (like Math.random()) use linear congruential or Mersenne Twister algorithms optimized for speed and statistical uniformity, but their internal state can be completely reconstructed after observing a few outputs.',
      'CSPRNGs (such as crypto.getRandomValues()) sample true hardware entropy pools (interrupt timing, thermal noise, hardware RNG instructions like RDRAND) and feed them through cryptographically secure mixing primitives.',
      'Next-bit test: Given the first k bits of a CSPRNG sequence, no polynomial-time algorithm can predict the (k+1)-th bit with probability significantly greater than 50%.'
    ],
    inCipherLab: 'Randomness Lab uses window.crypto.getRandomValues() with chunking to generate up to 64 KiB of true cryptographic entropy with real sample distribution histograms.',
    securityConsideration: 'Never use Math.random() for session IDs, password resets, cryptographic keys, salt generation, or authentication tokens.'
  },
  {
    id: 'file-integrity',
    title: 'File Integrity & Software Verification',
    category: 'Integrity',
    summary: 'Using cryptographic digests to ensure software packages, firmware updates, or disk images have not been corrupted during transit or tampered with by adversaries.',
    details: [
      'Verification Principle: If a downloaded file matches the vendor-published SHA-256 checksum exactly, the recipient knows the file is bit-for-bit identical to what the vendor released.',
      'Mitigating Transmission Errors: Protects against packet loss, incomplete downloads, and accidental bit rot on storage media.',
      'Adversary Warning: If an attacker compromises the distribution server or the transmission channel (man-in-the-middle) and replaces BOTH the file and the published checksum, integrity verification alone cannot detect the deception.'
    ],
    inCipherLab: 'Integrity Checker computes SHA-256/384/512 on local files in the browser and matches them against vendor reference hashes.',
    securityConsideration: 'A hash match only verifies that the file matches the provided checksum. Authenticity requires obtaining the checksum over a trusted, authenticated channel (e.g. signed with GPG/PGP or retrieved over verified TLS).'
  },
  {
    id: 'symmetric-encryption',
    title: 'Symmetric Key Encryption',
    category: 'Encryption',
    summary: 'Cryptographic schemes where the exact same secret key is used for both encrypting plaintext and decrypting ciphertext.',
    details: [
      'Block Ciphers (AES): Advanced Encryption Standard processes data in fixed 128-bit blocks using 128, 192, or 256-bit keys.',
      'Authenticated Encryption with Associated Data (AEAD): Modern symmetric ciphers (AES-GCM, ChaCha20-Poly1305) provide both confidentiality AND integrity authentication, preventing chosen-ciphertext tampering.',
      'Initialization Vectors (IV / Nonces): A unique value that must never be reused with the same key, ensuring identical plaintexts encrypt to different ciphertexts.'
    ],
    inCipherLab: 'Educational reference only. CipherLab operates without secrets or server dependencies.',
    securityConsideration: 'Never use Electronic Codebook (ECB) mode; ECB does not disguise plaintext patterns (the famous ECB Penguin effect). Always use AEAD modes (AES-GCM).'
  },
  {
    id: 'asymmetric-crypto',
    title: 'Asymmetric (Public-Key) Cryptography',
    category: 'Encryption',
    summary: 'Cryptosystems that utilize mathematically linked pairs of keys: a public key for encryption/verification and a private key for decryption/signing.',
    details: [
      'Core Mechanics: Anyone can encrypt a message using the recipient’s public key, but only the holder of the corresponding private key can decrypt it.',
      'Mathematical Foundations: Relies on computationally hard problems such as integer factorization (RSA) or the discrete logarithm problem over elliptic curve groups (ECC, Curve25519, NIST P-256).',
      'Key Size Efficiency: A 256-bit Elliptic Curve key provides roughly equivalent cryptographic strength to a 3072-bit RSA key while consuming drastically less bandwidth and computing power.'
    ],
    inCipherLab: 'Reference concepts explaining the role of public keys in TLS, SSH, and digital signature infrastructure.',
    securityConsideration: 'Private keys must remain secret under all circumstances. Once a private key is exposed, all past and future communications relying on it can be decrypted unless forward secrecy is employed.'
  },
  {
    id: 'digital-signatures',
    title: 'Digital Signatures & Non-Repudiation',
    category: 'Integrity',
    summary: 'A cryptographic mechanism that binds the identity of an author or system to a digital document or transaction.',
    details: [
      'Signing Process: The signer computes a cryptographic hash of the document, then encrypts/signs the digest using their private key.',
      'Verification Process: Any verifier can decrypt the signature with the signer’s public key and compare it to a fresh hash of the document.',
      'Triple Security Guarantee: Provides Authentication (proves who created it), Integrity (proves it was not altered), and Non-repudiation (the signer cannot credibly deny signing it).'
    ],
    inCipherLab: 'Underpins code signing, TLS certificates, and secure software distribution pipelines.',
    securityConsideration: 'Signing large documents directly with asymmetric algorithms is computationally prohibitive; protocols always sign the cryptographic hash of the document instead of the raw document.'
  },
  {
    id: 'key-derivation',
    title: 'Key Derivation Functions (KDFs) & Password Hashing',
    category: 'Key Management',
    summary: 'Algorithms specifically designed to transform low-entropy secrets (like user passwords) into high-entropy cryptographic keys or secure verification hashes.',
    details: [
      'Work Factor / Slowness: Unlike general-purpose hashes (SHA-256) which are engineered to run as fast as possible, KDFs are deliberately designed to be computationally slow and resource-heavy.',
      'Memory Hardness: Modern algorithms like Argon2 and Scrypt require significant RAM allocations, neutralizing the speed advantages of ASIC and GPU brute-force clusters.',
      'Salts: Cryptographically random nonces appended to passwords before hashing to ensure identical passwords have unique digests and eliminate precomputed rainbow table attacks.'
    ],
    inCipherLab: 'Highlighted in Hash Studio as the critical reason why SHA-256 is NOT suitable for storing passwords.',
    securityConsideration: 'Standard fast hashes (MD5, SHA-1, SHA-256, SHA-512) can be calculated billions of times per second on consumer graphics cards. Always use Argon2id, bcrypt, or PBKDF2-HMAC-SHA256 with calibrated work factors for authentication credentials.'
  }
];
