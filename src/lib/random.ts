/**
 * Maximum safe chunk size supported across all major browser WebCrypto implementations.
 * WebCrypto limits single getRandomValues calls to 65,536 bytes (64 KiB).
 */
const MAX_CRYPTO_CHUNK = 65536;

export interface HistogramResult {
  sampleSize: number;
  distinctByteCount: number;
  expectedFrequencyPerByte: number;
  minFrequency: number;
  maxFrequency: number;
  meanFrequency: number;
  // 16 bins for compact visualization (0x00-0x0F, 0x10-0x1F, ..., 0xF0-0xFF)
  bins: {
    rangeLabel: string;
    start: number;
    end: number;
    count: number;
    percentage: number;
  }[];
  // Full 256 byte frequency counts for technical depth
  byteFrequencies: number[];
}

/**
 * Generates cryptographically secure random bytes using crypto.getRandomValues().
 * Uses safe chunking for requests of any size.
 */
export function generateSecureRandomBytes(byteLength: number): Uint8Array {
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : (typeof globalThis !== 'undefined' ? globalThis.crypto : null);

  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Cryptographically Secure Pseudorandom Number Generator (CSPRNG) is not supported in this environment.');
  }

  if (byteLength <= 0) {
    return new Uint8Array(0);
  }

  const result = new Uint8Array(byteLength);
  let offset = 0;

  while (offset < byteLength) {
    const chunkSize = Math.min(byteLength - offset, MAX_CRYPTO_CHUNK);
    const chunk = new Uint8Array(chunkSize);
    cryptoObj.getRandomValues(chunk);
    result.set(chunk, offset);
    offset += chunkSize;
  }

  return result;
}

/**
 * Computes frequency distribution and histogram statistics from an actual byte sample.
 */
export function computeByteHistogram(bytes: Uint8Array): HistogramResult {
  const byteFrequencies = new Array<number>(256).fill(0);

  for (let i = 0; i < bytes.length; i++) {
    byteFrequencies[bytes[i]]++;
  }

  let distinctByteCount = 0;
  let minFrequency = bytes.length > 0 ? Number.MAX_SAFE_INTEGER : 0;
  let maxFrequency = 0;

  for (let b = 0; b < 256; b++) {
    const count = byteFrequencies[b];
    if (count > 0) {
      distinctByteCount++;
    }
    if (bytes.length > 0) {
      if (count < minFrequency) minFrequency = count;
      if (count > maxFrequency) maxFrequency = count;
    }
  }

  if (bytes.length === 0) {
    minFrequency = 0;
  }

  const expectedFrequencyPerByte = bytes.length > 0 ? bytes.length / 256 : 0;
  const meanFrequency = bytes.length / 256;

  // Group into 16 bins (16 values each, e.g., 0x00-0x0F, 0x10-0x1F, ...)
  const bins: HistogramResult['bins'] = [];
  for (let binIdx = 0; binIdx < 16; binIdx++) {
    const start = binIdx * 16;
    const end = start + 15;
    let count = 0;
    for (let byteVal = start; byteVal <= end; byteVal++) {
      count += byteFrequencies[byteVal];
    }
    const percentage = bytes.length > 0 ? (count / bytes.length) * 100 : 0;
    const rangeLabel = `0x${start.toString(16).toUpperCase().padStart(2, '0')}-0x${end.toString(16).toUpperCase().padStart(2, '0')}`;
    bins.push({
      rangeLabel,
      start,
      end,
      count,
      percentage: Number(percentage.toFixed(2)),
    });
  }

  return {
    sampleSize: bytes.length,
    distinctByteCount,
    expectedFrequencyPerByte: Number(expectedFrequencyPerByte.toFixed(2)),
    minFrequency,
    maxFrequency,
    meanFrequency: Number(meanFrequency.toFixed(2)),
    bins,
    byteFrequencies,
  };
}
