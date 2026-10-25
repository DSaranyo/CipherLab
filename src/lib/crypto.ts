import { SupportedHashAlgo, DiffResult } from '../types';

/**
 * Checks whether the environment supports Web Cryptography API.
 */
export function isWebCryptoAvailable(): boolean {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : (typeof globalThis !== 'undefined' ? globalThis.crypto : null);
  return !!cryptoObj && !!cryptoObj.subtle && typeof cryptoObj.subtle.digest === 'function';
}

/**
 * Convert an ArrayBuffer or Uint8Array into a lowercase hexadecimal string.
 */
export function bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Computes a cryptographic digest using Web Crypto subtle.digest().
 * Supports SHA-256, SHA-384, and SHA-512.
 */
export async function computeHash(
  algorithm: SupportedHashAlgo,
  data: Uint8Array | string
): Promise<{
  hex: string;
  bytes: Uint8Array;
  byteLength: number;
  bitLength: number;
  elapsedMs: number;
}> {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : (typeof globalThis !== 'undefined' ? globalThis.crypto : null);

  if (!cryptoObj || !cryptoObj.subtle || typeof cryptoObj.subtle.digest !== 'function') {
    throw new Error('Web Crypto API (crypto.subtle.digest) is not supported in this environment.');
  }

  const rawBytes: Uint8Array = typeof data === 'string'
    ? new TextEncoder().encode(data)
    : data;

  const startTime = performance.now();
  const hashBuffer = await cryptoObj.subtle.digest(algorithm, rawBytes as unknown as BufferSource);
  const elapsedMs = Math.max(0.01, performance.now() - startTime);

  const hashBytes = new Uint8Array(hashBuffer);
  const hex = bufferToHex(hashBytes);

  return {
    hex,
    bytes: hashBytes,
    byteLength: hashBytes.length,
    bitLength: hashBytes.length * 8,
    elapsedMs,
  };
}

/**
 * Performs character-by-character visual diff comparison between two hexadecimal digests.
 */
export function computeHashDiff(hashA: string, hashB: string): DiffResult {
  const cleanA = hashA.trim().toLowerCase();
  const cleanB = hashB.trim().toLowerCase();
  const maxLength = Math.max(cleanA.length, cleanB.length);

  let matchChars = 0;
  let diffChars = 0;
  const charDiffs: DiffResult['charDiffs'] = [];

  for (let i = 0; i < maxLength; i++) {
    const charA = cleanA[i] || '';
    const charB = cleanB[i] || '';
    const isMatch = charA === charB && charA !== '';

    if (isMatch) {
      matchChars++;
    } else {
      diffChars++;
    }

    charDiffs.push({
      charA,
      charB,
      isMatch,
      index: i,
    });
  }

  const diffPercentage = maxLength > 0 ? (diffChars / maxLength) * 100 : 0;

  return {
    totalChars: maxLength,
    diffChars,
    diffPercentage: Number(diffPercentage.toFixed(2)),
    matchChars,
    charDiffs,
  };
}

/**
 * Expected digest lengths in bits and hex characters for supported algorithms.
 */
export const HASH_ALGO_METADATA: Record<SupportedHashAlgo, {
  name: SupportedHashAlgo;
  bitLength: number;
  byteLength: number;
  hexLength: number;
  standard: string;
  recommendedUse: string;
}> = {
  'SHA-256': {
    name: 'SHA-256',
    bitLength: 256,
    byteLength: 32,
    hexLength: 64,
    standard: 'FIPS PUB 180-4',
    recommendedUse: 'Standard general-purpose digest, blockchain proofs, HMAC verification, git commit digests.',
  },
  'SHA-384': {
    name: 'SHA-384',
    bitLength: 384,
    byteLength: 48,
    hexLength: 96,
    standard: 'FIPS PUB 180-4',
    recommendedUse: 'High-assurance government & enterprise applications, TLS cipher suites (Suite B).',
  },
  'SHA-512': {
    name: 'SHA-512',
    bitLength: 512,
    byteLength: 64,
    hexLength: 128,
    standard: 'FIPS PUB 180-4',
    recommendedUse: 'Maximum collision resistance, 64-bit optimized processing architectures, key derivation pipelines.',
  },
};
