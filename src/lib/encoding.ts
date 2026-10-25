import { SupportedEncoding } from '../types';

/**
 * UTF-8 String to Uint8Array
 */
export function textToBytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/**
 * Uint8Array to UTF-8 String with error detection for malformed sequences
 */
export function bytesToText(bytes: Uint8Array): string {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  return decoder.decode(bytes);
}

/**
 * Uint8Array to Lowercase Hexadecimal string
 */
export function bytesToHex(bytes: Uint8Array, spaced = false): string {
  const hexParts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    hexParts.push(bytes[i].toString(16).padStart(2, '0'));
  }
  return spaced ? hexParts.join(' ') : hexParts.join('');
}

/**
 * Hexadecimal string to Uint8Array
 * Handles spaces/colons and validates characters
 */
export function hexToBytes(hex: string): Uint8Array {
  // Strip whitespace, hyphens, colons, or 0x prefixes
  let cleaned = hex.trim().replace(/^0x/i, '').replace(/[\s\-_:]/g, '');

  if (cleaned.length === 0) {
    return new Uint8Array(0);
  }

  if (cleaned.length % 2 !== 0) {
    throw new Error(`Hexadecimal string has an odd number of characters (${cleaned.length}). Hex bytes must be in complete pairs (2 characters per byte).`);
  }

  if (!/^[0-9a-fA-F]+$/.test(cleaned)) {
    throw new Error('Hexadecimal string contains invalid characters. Only 0-9 and a-f (case insensitive) are permitted.');
  }

  const bytes = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < cleaned.length; i += 2) {
    bytes[i / 2] = parseInt(cleaned.substring(i, i + 2), 16);
  }

  return bytes;
}

/**
 * Uint8Array to Base64 string
 */
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Base64 string to Uint8Array
 */
export function base64ToBytes(base64: string): Uint8Array {
  // Clean whitespace and linebreaks
  const cleaned = base64.trim().replace(/[\r\n\s]/g, '');

  if (cleaned.length === 0) {
    return new Uint8Array(0);
  }

  // Validate Base64 characters and padding
  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!base64Regex.test(cleaned)) {
    throw new Error('Invalid Base64 string format. Ensure valid characters (A-Z, a-z, 0-9, +, /) and correct padding (=).');
  }

  try {
    const binary = atob(cleaned);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (err) {
    throw new Error(`Failed to decode Base64: ${err instanceof Error ? err.message : 'Unknown decode error'}`);
  }
}

/**
 * Uint8Array to 8-bit Binary string (e.g. "01000001 01000010")
 */
export function bytesToBinary(bytes: Uint8Array, spaced = true): string {
  const parts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    parts.push(bytes[i].toString(2).padStart(8, '0'));
  }
  return spaced ? parts.join(' ') : parts.join('');
}

/**
 * Binary string to Uint8Array
 */
export function binaryToBytes(binary: string): Uint8Array {
  // Clean out spaces and common separators
  const cleaned = binary.trim().replace(/[\s\-_]/g, '');

  if (cleaned.length === 0) {
    return new Uint8Array(0);
  }

  if (cleaned.length % 8 !== 0) {
    throw new Error(`Binary stream length (${cleaned.length} bits) is not a multiple of 8 bits. Each byte requires exactly 8 binary digits (0 or 1).`);
  }

  if (!/^[01]+$/.test(cleaned)) {
    throw new Error('Binary string contains invalid characters. Only 0 and 1 digits are permitted.');
  }

  const byteCount = cleaned.length / 8;
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    bytes[i] = parseInt(cleaned.substring(i * 8, (i + 1) * 8), 2);
  }

  return bytes;
}

/**
 * Validates input for a given encoding format
 */
export function validateEncodingInput(
  input: string,
  format: SupportedEncoding
): { valid: boolean; error?: string } {
  if (!input || input.trim() === '') {
    return { valid: true };
  }

  try {
    switch (format) {
      case 'utf8':
        textToBytes(input);
        return { valid: true };
      case 'hex':
        hexToBytes(input);
        return { valid: true };
      case 'base64':
        base64ToBytes(input);
        return { valid: true };
      case 'binary':
        binaryToBytes(input);
        return { valid: true };
    }
  } catch (err) {
    return {
      valid: false,
      error: err instanceof Error ? err.message : 'Invalid format',
    };
  }
}

/**
 * Universal converter from any supported encoding to any other supported encoding
 */
export function convertRepresentation(
  input: string,
  fromFormat: SupportedEncoding,
  toFormat: SupportedEncoding
): {
  output: string;
  bytes: Uint8Array;
  byteCount: number;
  charCount: number;
} {
  if (input === '') {
    return {
      output: '',
      bytes: new Uint8Array(0),
      byteCount: 0,
      charCount: 0,
    };
  }

  // Step 1: Decode source representation to raw bytes (Uint8Array)
  let bytes: Uint8Array;
  switch (fromFormat) {
    case 'utf8':
      bytes = textToBytes(input);
      break;
    case 'hex':
      bytes = hexToBytes(input);
      break;
    case 'base64':
      bytes = base64ToBytes(input);
      break;
    case 'binary':
      bytes = binaryToBytes(input);
      break;
  }

  // Step 2: Encode raw bytes to target representation
  let output = '';
  switch (toFormat) {
    case 'utf8':
      try {
        output = bytesToText(bytes);
      } catch {
        throw new Error('The raw bytes do not form valid UTF-8 sequences and cannot be rendered as text. Try Hex or Base64 instead.');
      }
      break;
    case 'hex':
      output = bytesToHex(bytes);
      break;
    case 'base64':
      output = bytesToBase64(bytes);
      break;
    case 'binary':
      output = bytesToBinary(bytes, true);
      break;
  }

  return {
    output,
    bytes,
    byteCount: bytes.length,
    charCount: output.length,
  };
}
