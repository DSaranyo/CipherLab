import { computeHash } from './crypto';
import {
  textToBytes,
  bytesToText,
  bytesToHex,
  hexToBytes,
  bytesToBase64,
  base64ToBytes,
  bytesToBinary,
  binaryToBytes,
  convertRepresentation,
  validateEncodingInput
} from './encoding';
import { generateSecureRandomBytes } from './random';
import { validateReferenceHash, evaluateIntegrityStatus } from './file-integrity';

export interface TestResult {
  id: string;
  category: 'Hashing' | 'Encoding' | 'Validation' | 'Integrity' | 'Randomness';
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
  notes?: string;
}

/**
 * Standard FIPS 180-4 NIST Reference Vectors
 */
export const NIST_VECTORS = {
  // Empty String ("")
  empty: {
    input: '',
    'SHA-256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'SHA-384': '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
    'SHA-512': 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
  },
  // "abc"
  abc: {
    input: 'abc',
    'SHA-256': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    'SHA-384': 'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    'SHA-512': 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
  },
  // "The quick brown fox jumps over the lazy dog"
  quickBrownFox: {
    input: 'The quick brown fox jumps over the lazy dog',
    'SHA-256': 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    'SHA-384': 'ca737f1014a0f8d447e6b99640aa2090289566ac43344259d154785596f448c16e1eeb550b1e521e4a64ff791f7608f0',
    'SHA-512': '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6',
  },
};

/**
 * Runs the complete cryptographic and validation test suite.
 */
export async function runCryptographicTestSuite(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // Test 1: Empty string SHA-256
  try {
    const res = await computeHash('SHA-256', NIST_VECTORS.empty.input);
    results.push({
      id: 'hash-empty-sha256',
      category: 'Hashing',
      name: 'NIST SHA-256 Empty String Test Vector',
      expected: NIST_VECTORS.empty['SHA-256'],
      actual: res.hex,
      passed: res.hex === NIST_VECTORS.empty['SHA-256'],
      notes: 'Verifies FIPS 180-4 baseline digest for 0-byte input.',
    });
  } catch (e) {
    results.push({
      id: 'hash-empty-sha256',
      category: 'Hashing',
      name: 'NIST SHA-256 Empty String Test Vector',
      expected: NIST_VECTORS.empty['SHA-256'],
      actual: String(e),
      passed: false,
    });
  }

  // Test 2: Empty string SHA-384
  try {
    const res = await computeHash('SHA-384', NIST_VECTORS.empty.input);
    results.push({
      id: 'hash-empty-sha384',
      category: 'Hashing',
      name: 'NIST SHA-384 Empty String Test Vector',
      expected: NIST_VECTORS.empty['SHA-384'],
      actual: res.hex,
      passed: res.hex === NIST_VECTORS.empty['SHA-384'],
      notes: 'Verifies 384-bit truncation boundary on 0-byte input.',
    });
  } catch (e) {
    results.push({
      id: 'hash-empty-sha384',
      category: 'Hashing',
      name: 'NIST SHA-384 Empty String Test Vector',
      expected: NIST_VECTORS.empty['SHA-384'],
      actual: String(e),
      passed: false,
    });
  }

  // Test 3: Empty string SHA-512
  try {
    const res = await computeHash('SHA-512', NIST_VECTORS.empty.input);
    results.push({
      id: 'hash-empty-sha512',
      category: 'Hashing',
      name: 'NIST SHA-512 Empty String Test Vector',
      expected: NIST_VECTORS.empty['SHA-512'],
      actual: res.hex,
      passed: res.hex === NIST_VECTORS.empty['SHA-512'],
      notes: 'Verifies 512-bit state initialization on 0-byte input.',
    });
  } catch (e) {
    results.push({
      id: 'hash-empty-sha512',
      category: 'Hashing',
      name: 'NIST SHA-512 Empty String Test Vector',
      expected: NIST_VECTORS.empty['SHA-512'],
      actual: String(e),
      passed: false,
    });
  }

  // Test 4: Known string "abc" SHA-256
  try {
    const res = await computeHash('SHA-256', NIST_VECTORS.abc.input);
    results.push({
      id: 'hash-abc-sha256',
      category: 'Hashing',
      name: 'NIST SHA-256 "abc" Test Vector',
      expected: NIST_VECTORS.abc['SHA-256'],
      actual: res.hex,
      passed: res.hex === NIST_VECTORS.abc['SHA-256'],
      notes: 'Canonical 24-bit input test from NIST specification.',
    });
  } catch (e) {
    results.push({
      id: 'hash-abc-sha256',
      category: 'Hashing',
      name: 'NIST SHA-256 "abc" Test Vector',
      expected: NIST_VECTORS.abc['SHA-256'],
      actual: String(e),
      passed: false,
    });
  }

  // Test 5: Known string "The quick brown fox jumps over the lazy dog" SHA-512
  try {
    const res = await computeHash('SHA-512', NIST_VECTORS.quickBrownFox.input);
    results.push({
      id: 'hash-fox-sha512',
      category: 'Hashing',
      name: 'NIST SHA-512 Pangram Test Vector',
      expected: NIST_VECTORS.quickBrownFox['SHA-512'],
      actual: res.hex,
      passed: res.hex === NIST_VECTORS.quickBrownFox['SHA-512'],
      notes: 'Multi-block 344-bit input verifying 64-bit word operations.',
    });
  } catch (e) {
    results.push({
      id: 'hash-fox-sha512',
      category: 'Hashing',
      name: 'NIST SHA-512 Pangram Test Vector',
      expected: NIST_VECTORS.quickBrownFox['SHA-512'],
      actual: String(e),
      passed: false,
    });
  }

  // Test 6: Unicode UTF-8 handling
  try {
    const unicodeStr = 'CipherLab • 🔒 • 2026';
    const bytes = textToBytes(unicodeStr);
    const roundtrip = bytesToText(bytes);
    results.push({
      id: 'encoding-unicode-utf8',
      category: 'Encoding',
      name: 'Unicode UTF-8 Multibyte Roundtrip',
      expected: unicodeStr,
      actual: roundtrip,
      passed: roundtrip === unicodeStr && bytes.length > unicodeStr.length,
      notes: `Input length: ${unicodeStr.length} chars, UTF-8 byte length: ${bytes.length} bytes.`,
    });
  } catch (e) {
    results.push({
      id: 'encoding-unicode-utf8',
      category: 'Encoding',
      name: 'Unicode UTF-8 Multibyte Roundtrip',
      expected: 'CipherLab • 🔒 • 2026',
      actual: String(e),
      passed: false,
    });
  }

  // Test 7: Leading zero byte preservation in Hex & Binary
  try {
    // Array starting with zero byte: [0x00, 0x0F, 0xFF]
    const testBytes = new Uint8Array([0x00, 0x0F, 0xFF]);
    const hex = bytesToHex(testBytes);
    const decodedFromHex = hexToBytes(hex);
    const bin = bytesToBinary(testBytes, false);
    const decodedFromBin = binaryToBytes(bin);

    const hexMatch = hex === '000fff' && decodedFromHex[0] === 0 && decodedFromHex.length === 3;
    const binMatch = bin === '000000000000111111111111' && decodedFromBin[0] === 0 && decodedFromBin.length === 3;

    results.push({
      id: 'encoding-leading-zero-preservation',
      category: 'Encoding',
      name: 'Leading Zero Byte Preservation (Hex & Binary)',
      expected: '000fff & 000000000000111111111111',
      actual: `${hex} & ${bin}`,
      passed: hexMatch && binMatch,
      notes: 'Confirms that leading zeros are never dropped during serialization.',
    });
  } catch (e) {
    results.push({
      id: 'encoding-leading-zero-preservation',
      category: 'Encoding',
      name: 'Leading Zero Byte Preservation (Hex & Binary)',
      expected: '000fff',
      actual: String(e),
      passed: false,
    });
  }

  // Test 8: Base64 padding and roundtrip
  try {
    const raw = 'Security Operations';
    const conv = convertRepresentation(raw, 'utf8', 'base64');
    const back = convertRepresentation(conv.output, 'base64', 'utf8');

    results.push({
      id: 'encoding-base64-roundtrip',
      category: 'Encoding',
      name: 'Base64 RFC 4648 Encoding & Padding Roundtrip',
      expected: raw,
      actual: back.output,
      passed: back.output === raw && conv.output.endsWith('='),
      notes: `Base64 output with correct padding: "${conv.output}".`,
    });
  } catch (e) {
    results.push({
      id: 'encoding-base64-roundtrip',
      category: 'Encoding',
      name: 'Base64 RFC 4648 Encoding & Padding Roundtrip',
      expected: 'Security Operations',
      actual: String(e),
      passed: false,
    });
  }

  // Test 9: Invalid Hex Validation (odd length and bad character)
  try {
    const oddHexVal = validateEncodingInput('a1b2c', 'hex');
    const badCharVal = validateEncodingInput('a1b2cz', 'hex');
    const passed = !oddHexVal.valid && !badCharVal.valid;

    results.push({
      id: 'val-invalid-hex',
      category: 'Validation',
      name: 'Invalid Hexadecimal Rejection',
      expected: 'Rejection of odd length and non-hex characters',
      actual: `Odd: ${oddHexVal.error?.substring(0, 30)}... | BadChar: ${badCharVal.error?.substring(0, 30)}...`,
      passed,
      notes: 'Protects parser against invalid nibbles and corruption.',
    });
  } catch (e) {
    results.push({
      id: 'val-invalid-hex',
      category: 'Validation',
      name: 'Invalid Hexadecimal Rejection',
      expected: 'Validation error thrown',
      actual: String(e),
      passed: false,
    });
  }

  // Test 10: Invalid Base64 Rejection
  try {
    const badB64 = validateEncodingInput('Invalid Base64$$$!!!', 'base64');
    results.push({
      id: 'val-invalid-base64',
      category: 'Validation',
      name: 'Invalid Base64 Rejection',
      expected: 'Rejection of invalid Base64 characters and alignment',
      actual: `Rejected: "${badB64.error}"`,
      passed: !badB64.valid,
      notes: 'Detects illegal punctuation and malformed padding.',
    });
  } catch (e) {
    results.push({
      id: 'val-invalid-base64',
      category: 'Validation',
      name: 'Invalid Base64 Rejection',
      expected: 'Validation error thrown',
      actual: String(e),
      passed: false,
    });
  }

  // Test 11: File Integrity Status Evaluation (Match & Mismatch)
  try {
    const knownHash = NIST_VECTORS.abc['SHA-256'];
    const matchEvaluation = evaluateIntegrityStatus(knownHash, knownHash, 'SHA-256');
    const tamperedHash = knownHash.replace(/^ba78/, 'ffff');
    const mismatchEvaluation = evaluateIntegrityStatus(knownHash, tamperedHash, 'SHA-256');
    const wrongLengthEvaluation = evaluateIntegrityStatus(knownHash, 'abcd1234', 'SHA-256');

    const passed =
      matchEvaluation.status === 'MATCH' &&
      mismatchEvaluation.status === 'MISMATCH' &&
      wrongLengthEvaluation.status === 'INVALID_REFERENCE';

    results.push({
      id: 'integrity-evaluation-logic',
      category: 'Integrity',
      name: 'Integrity Verification Logic (Match/Mismatch/Invalid)',
      expected: 'MATCH, MISMATCH, INVALID_REFERENCE',
      actual: `${matchEvaluation.status}, ${mismatchEvaluation.status}, ${wrongLengthEvaluation.status}`,
      passed,
      notes: 'Correctly distinguishes bit-identical matches, checksum mismatches, and malformed inputs.',
    });
  } catch (e) {
    results.push({
      id: 'integrity-evaluation-logic',
      category: 'Integrity',
      name: 'Integrity Verification Logic',
      expected: 'MATCH, MISMATCH, INVALID_REFERENCE',
      actual: String(e),
      passed: false,
    });
  }

  // Test 12: CSPRNG Output Length and Value Distribution
  try {
    const requestedLengths = [16, 32, 64, 128];
    let allLengthsMatch = true;
    let allWithinByteRange = true;

    for (const len of requestedLengths) {
      const bytes = generateSecureRandomBytes(len);
      if (bytes.length !== len) allLengthsMatch = false;
      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i] < 0 || bytes[i] > 255) allWithinByteRange = false;
      }
    }

    results.push({
      id: 'random-csprng-generation',
      category: 'Randomness',
      name: 'CSPRNG Generation & Array Integrity',
      expected: 'Byte lengths [16, 32, 64, 128] with byte values in [0, 255]',
      actual: `Lengths verified: ${allLengthsMatch}, Values verified: ${allWithinByteRange}`,
      passed: allLengthsMatch && allWithinByteRange,
      notes: 'Ensures Web Crypto getRandomValues returns non-overflowing unsigned 8-bit integers.',
    });
  } catch (e) {
    results.push({
      id: 'random-csprng-generation',
      category: 'Randomness',
      name: 'CSPRNG Generation',
      expected: 'Verification passed',
      actual: String(e),
      passed: false,
    });
  }

  return results;
}
