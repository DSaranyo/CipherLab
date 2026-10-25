import assert from 'node:assert';
import { computeHash } from '../src/lib/crypto';
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
} from '../src/lib/encoding';
import { generateSecureRandomBytes } from '../src/lib/random';
import { validateReferenceHash, evaluateIntegrityStatus } from '../src/lib/file-integrity';

async function runTests() {
  console.log('--- CIPHERLAB CRYPTOGRAPHIC TEST SUITE ---');

  // Test 1: Empty string hashes
  const empty256 = await computeHash('SHA-256', '');
  assert.strictEqual(
    empty256.hex,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'SHA-256 empty string should match NIST vector'
  );
  console.log('✔ Test 1 Passed: Empty string SHA-256');

  const empty384 = await computeHash('SHA-384', '');
  assert.strictEqual(
    empty384.hex,
    '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
    'SHA-384 empty string should match NIST vector'
  );
  console.log('✔ Test 2 Passed: Empty string SHA-384');

  const empty512 = await computeHash('SHA-512', '');
  assert.strictEqual(
    empty512.hex,
    'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
    'SHA-512 empty string should match NIST vector'
  );
  console.log('✔ Test 3 Passed: Empty string SHA-512');

  // Test 2: Known test vectors
  const abc256 = await computeHash('SHA-256', 'abc');
  assert.strictEqual(
    abc256.hex,
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    'SHA-256 "abc" should match canonical NIST vector'
  );
  console.log('✔ Test 4 Passed: SHA-256 "abc" canonical vector');

  const fox512 = await computeHash('SHA-512', 'The quick brown fox jumps over the lazy dog');
  assert.strictEqual(
    fox512.hex,
    '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6',
    'SHA-512 Pangram vector should match NIST FIPS 180-4'
  );
  console.log('✔ Test 5 Passed: SHA-512 Pangram vector');

  // Test 3: Unicode text encoding
  const unicodeStr = '🔒 CipherLab 实验室 🛡️';
  const encodedBytes = textToBytes(unicodeStr);
  const decodedStr = bytesToText(encodedBytes);
  assert.strictEqual(decodedStr, unicodeStr, 'Unicode UTF-8 roundtrip must match exactly');
  assert.ok(encodedBytes.length > unicodeStr.length, 'Multibyte characters must expand byte length');
  console.log('✔ Test 6 Passed: Multibyte Unicode UTF-8 roundtrip');

  // Test 4: Leading zero byte preservation
  const zeroBytes = new Uint8Array([0x00, 0x01, 0x00]);
  const hexWithZeros = bytesToHex(zeroBytes);
  assert.strictEqual(hexWithZeros, '000100', 'Hex must preserve leading and intermediate zeros');
  const restoredBytes = hexToBytes(hexWithZeros);
  assert.deepStrictEqual(Array.from(restoredBytes), [0, 1, 0], 'Restored bytes must preserve zeros');

  const binWithZeros = bytesToBinary(zeroBytes, false);
  assert.strictEqual(binWithZeros, '000000000000000100000000', 'Binary must preserve 8 bits per byte');
  const restoredBinBytes = binaryToBytes(binWithZeros);
  assert.deepStrictEqual(Array.from(restoredBinBytes), [0, 1, 0], 'Binary decode must preserve zeros');
  console.log('✔ Test 7 Passed: Leading and intermediate zero byte preservation');

  // Test 5: Base64 encoding/decoding roundtrip with padding
  const rawText = 'Tactical Security Protocol';
  const b64 = convertRepresentation(rawText, 'utf8', 'base64');
  const b64Decoded = convertRepresentation(b64.output, 'base64', 'utf8');
  assert.strictEqual(b64Decoded.output, rawText, 'Base64 roundtrip must match original plaintext');
  console.log('✔ Test 8 Passed: Base64 roundtrip with RFC 4648 padding');

  // Test 6: Invalid Base64 and Hexadecimal validation
  const invalidHex = validateEncodingInput('abc12z', 'hex');
  assert.strictEqual(invalidHex.valid, false, 'Invalid hex char "z" should fail validation');
  const oddHex = validateEncodingInput('abc12', 'hex');
  assert.strictEqual(oddHex.valid, false, 'Odd-length hex should fail validation');

  const invalidB64 = validateEncodingInput('Not Valid Base64***!', 'base64');
  assert.strictEqual(invalidB64.valid, false, 'Invalid Base64 characters should fail validation');
  console.log('✔ Test 9 Passed: Invalid Hex and Base64 format rejection');

  // Test 7: Integrity verification statuses
  const testHash = abc256.hex;
  const matchResult = evaluateIntegrityStatus(testHash, testHash, 'SHA-256');
  assert.strictEqual(matchResult.status, 'MATCH', 'Identical hashes must evaluate to MATCH');

  const mismatchResult = evaluateIntegrityStatus(testHash, testHash.replace(/^ba78/, '0000'), 'SHA-256');
  assert.strictEqual(mismatchResult.status, 'MISMATCH', 'Altered hashes must evaluate to MISMATCH');

  const invalidLengthRef = evaluateIntegrityStatus(testHash, '1234abcd', 'SHA-256');
  assert.strictEqual(invalidLengthRef.status, 'INVALID_REFERENCE', 'Short hex string must evaluate to INVALID_REFERENCE');
  console.log('✔ Test 10 Passed: File integrity evaluation states (MATCH, MISMATCH, INVALID_REFERENCE)');

  // Test 8: Random byte generation lengths
  for (const len of [16, 32, 64, 128]) {
    const rand = generateSecureRandomBytes(len);
    assert.strictEqual(rand.length, len, `Random byte array length must equal ${len}`);
  }
  console.log('✔ Test 11 Passed: CSPRNG generation lengths');

  console.log('\nALL 11 UNIT TESTS PASSED SUCCESSFULLY.');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
