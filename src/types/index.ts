export type NavigationModule =
  | 'overview'
  | 'hash-studio'
  | 'encoding-lab'
  | 'randomness-lab'
  | 'integrity-checker'
  | 'crypto-playground'
  | 'concepts'
  | 'history';

export type SupportedHashAlgo = 'SHA-256' | 'SHA-384' | 'SHA-512';

export type SupportedEncoding = 'utf8' | 'hex' | 'base64' | 'binary';

export interface OperationRecord {
  id: string;
  timestamp: string; // ISO string
  type: 'hash' | 'encode' | 'random' | 'integrity' | 'comparison';
  algorithmOrFormat: string;
  status: 'success' | 'failure';
  details: string; // Non-sensitive description, e.g. "32 bytes generated", "SHA-256 computed on 1.4KB"
  inputSizeLabel?: string;
  outputSizeLabel?: string;
  durationMs?: number;
}

export type IntegrityStatus =
  | 'MATCH'
  | 'MISMATCH'
  | 'AWAITING_REFERENCE'
  | 'INVALID_REFERENCE';

export interface IntegrityVerification {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  algorithm: SupportedHashAlgo;
  computedHash: string;
  referenceHash: string;
  status: IntegrityStatus;
  elapsedMs: number;
  lastVerifiedAt: string;
}

export interface DiffResult {
  totalChars: number;
  diffChars: number;
  diffPercentage: number;
  matchChars: number;
  charDiffs: {
    charA: string;
    charB: string;
    isMatch: boolean;
    index: number;
  }[];
}

export interface ConceptItem {
  id: string;
  title: string;
  category: 'Hashing' | 'Encryption' | 'Integrity' | 'Randomness' | 'Key Management';
  summary: string;
  details: string[];
  inCipherLab: string; // How it relates to tools implemented in CipherLab
  securityConsideration: string;
}
