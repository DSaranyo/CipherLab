import React, { useState, useEffect, useId } from 'react';
import { SupportedHashAlgo, OperationRecord } from '../../types';
import { computeHash, computeHashDiff, HASH_ALGO_METADATA } from '../../lib/crypto';
import { textToBytes } from '../../lib/encoding';
import { DataPanel } from '../../components/DataPanel';
import { CopyButton } from '../../components/CopyButton';
import { DownloadButton } from '../../components/DownloadButton';
import {
  Hash,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
} from 'lucide-react';

interface HashStudioProps {
  onLogOperation: (record: Omit<OperationRecord, 'id' | 'timestamp'>) => void;
}

const BUILT_IN_EXAMPLES = [
  { label: 'Empty String', value: '' },
  { label: 'NIST "abc"', value: 'abc' },
  { label: 'Fox Pangram', value: 'The quick brown fox jumps over the lazy dog' },
  { label: 'CipherLab Vector', value: 'CIPHERLAB_TACTICAL_TELEMETRY_VECTOR_2026' },
];

export const HashStudio: React.FC<HashStudioProps> = ({ onLogOperation }) => {
  const fileInputId = useId();
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog');
  const [algorithm, setAlgorithm] = useState<SupportedHashAlgo>('SHA-256');
  const [autoCompute, setAutoCompute] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [resultHex, setResultHex] = useState<string>('');
  const [resultBits, setResultBits] = useState<number>(0);
  const [resultBytes, setResultBytes] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  // Reference comparison state
  const [referenceInput, setReferenceInput] = useState('');
  const [showEducational, setShowEducational] = useState(false);

  // UTF-8 Byte calculation
  const byteCount = textToBytes(inputText).length;
  const charCount = inputText.length;

  const handleCompute = async (targetAlgo = algorithm, targetInput = inputText) => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await computeHash(targetAlgo, targetInput);
      setResultHex(result.hex);
      setResultBits(result.bitLength);
      setResultBytes(result.byteLength);
      setElapsedMs(result.elapsedMs);

      onLogOperation({
        type: 'hash',
        algorithmOrFormat: targetAlgo,
        status: 'success',
        details: `${targetInput.length} chars (${textToBytes(targetInput).length} bytes)`,
        inputSizeLabel: `${textToBytes(targetInput).length} bytes`,
        outputSizeLabel: `${result.byteLength} bytes (${result.bitLength}-bit)`,
        durationMs: Number(result.elapsedMs.toFixed(2)),
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Cryptographic computation failure.';
      setError(msg);
      setResultHex('');
      onLogOperation({
        type: 'hash',
        algorithmOrFormat: targetAlgo,
        status: 'failure',
        details: msg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-run on text or algo change if autoCompute is on
  useEffect(() => {
    if (autoCompute) {
      handleCompute(algorithm, inputText);
    }
  }, [algorithm, inputText, autoCompute]);

  // Handle small local file upload into text editor
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File exceeds 2 MB text editor threshold. Use the Integrity Checker for large binary files.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInputText(content);
        setError(null);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
  };

  // Diff comparison logic against reference
  const diff = referenceInput.trim() ? computeHashDiff(resultHex, referenceInput) : null;
  const expectedLength = HASH_ALGO_METADATA[algorithm].hexLength;
  const isReferenceLengthValid = referenceInput.trim().length === 0 || referenceInput.trim().length === expectedLength;
  const isExactMatch = diff && diff.diffChars === 0 && resultHex.length === referenceInput.trim().length;

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              HASH STUDIO
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Compute cryptographic digests via native W3C WebCrypto API. Verify integrity and evaluate avalanche diffs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-mono text-[#8A968D] cursor-pointer">
            <input
              type="checkbox"
              checked={autoCompute}
              onChange={(e) => setAutoCompute(e.target.checked)}
              className="accent-[#667653] cursor-pointer"
            />
            <span className="select-none">LIVE RE-COMPUTE</span>
          </label>

          <button
            type="button"
            onClick={() => setShowEducational(!showEducational)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showEducational ? 'HIDE GUIDE' : 'CRYPTOGRAPHIC GUIDE'}</span>
            {showEducational ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Educational Guide (Collapsible) */}
      {showEducational && (
        <div className="bg-[#111815] border border-[#28342D] p-5 space-y-4 text-xs font-mono text-[#8A968D]">
          <div className="flex items-center justify-between border-b border-[#28342D] pb-2">
            <span className="text-[#E4E9E3] font-bold uppercase tracking-wider">
              Cryptographic Hash Functions: Technical Reference
            </span>
            <span className="text-[10px] text-[#A3B18A]">FIPS PUB 180-4 SPECIFICATION</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#A3B18A] font-semibold uppercase">1. One-Way Property</h3>
              <p className="text-[11px] leading-relaxed">
                Cryptographic hashes are mathematical trapdoor functions. They are irreversible: there is no decrypting a SHA-256 digest back into its original plaintext.
              </p>
            </div>
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#A3B18A] font-semibold uppercase">2. Hashing ≠ Encryption</h3>
              <p className="text-[11px] leading-relaxed">
                Encryption requires a cryptographic secret key and can be decrypted. Hashing has no key (unlike HMAC) and produces a fixed-size fingerprint rather than recoverable ciphertext.
              </p>
            </div>
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#E5AE54] font-semibold uppercase">3. Password Storage Warning</h3>
              <p className="text-[11px] leading-relaxed">
                SHA-256 alone must NOT be used for password databases. GPU clusters compute billions of SHA-256 hashes per second. Use memory-hard KDFs (Argon2id, bcrypt, PBKDF2) for credentials.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3-Part Technical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Panel: Input Editor (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <DataPanel
            title="Data Input Buffer"
            subtitle="Raw Text or UTF-8 Byte Stream"
            className="h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-4"
            headerAction={
              <div className="flex items-center gap-2">
                <label
                  htmlFor={fileInputId}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8A968D] hover:text-[#E4E9E3] cursor-pointer"
                  title="Load small local text file into input buffer"
                >
                  <Upload className="w-3 h-3 text-[#A3B18A]" />
                  <span>LOAD FILE</span>
                  <input
                    id={fileInputId}
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setInputText('')}
                  className="text-[11px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>CLEAR</span>
                </button>
              </div>
            }
          >
            <div className="space-y-2 flex-1 flex flex-col">
              <label htmlFor="hash-input-textarea" className="sr-only">Data Input Buffer</label>
              <textarea
                id="hash-input-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter arbitrary text or data payload to hash..."
                rows={8}
                className="w-full flex-1 p-3 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3] resize-none selection:bg-[#667653]/40"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A968D] px-1">
                <span>
                  Length: <strong className="text-[#E4E9E3] font-normal">{charCount}</strong> chars
                </span>
                <span>
                  UTF-8: <strong className="text-[#E4E9E3] font-normal">{byteCount}</strong> bytes ({byteCount * 8} bits)
                </span>
              </div>
            </div>

            {/* Built-in Harmless Test Vectors */}
            <div className="space-y-1.5 pt-2 border-t border-[#28342D]/60">
              <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                LOAD TEST VECTORS:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BUILT_IN_EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => setInputText(ex.value)}
                    className="px-2 py-1 text-[11px] font-mono bg-[#17201B] hover:bg-[#28342D] text-[#A3B18A] hover:text-[#E4E9E3] border border-[#28342D] transition-colors cursor-pointer"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </DataPanel>
        </div>

        {/* Center Panel: Algorithm Selection & Controls (2 cols) */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <DataPanel title="Algorithm" subtitle="FIPS 180-4 Suite">
            <div className="space-y-2">
              {(['SHA-256', 'SHA-384', 'SHA-512'] as SupportedHashAlgo[]).map((algo) => {
                const isSelected = algorithm === algo;
                const meta = HASH_ALGO_METADATA[algo];
                return (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => setAlgorithm(algo)}
                    className={`w-full text-left p-2.5 font-mono text-xs border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#667653]/30 border-[#B7F397] text-[#E4E9E3]'
                        : 'bg-[#17201B] border-[#28342D] text-[#8A968D] hover:text-[#E4E9E3] hover:bg-[#28342D]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{algo}</span>
                      <span className="text-[10px] text-[#A3B18A]">{meta.bitLength} bits</span>
                    </div>
                    <div className="text-[10px] text-[#8A968D] mt-0.5">
                      {meta.hexLength} hex characters
                    </div>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handleCompute(algorithm, inputText)}
                disabled={isProcessing}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#667653] hover:bg-[#A3B18A] text-[#080B0A] font-mono text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isProcessing ? 'CALCULATING...' : 'GENERATE DIGEST'}</span>
              </button>
            </div>
          </DataPanel>
        </div>

        {/* Right Panel: Output & Reference Comparison (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <DataPanel
            title="Cryptographic Digest"
            subtitle={`${algorithm} Hex Output`}
            className="h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-4"
            headerAction={
              <div className="flex items-center gap-2">
                <CopyButton textToCopy={resultHex} label="COPY" size="sm" />
                <DownloadButton
                  content={resultHex}
                  filename={`${algorithm.toLowerCase()}_digest.txt`}
                  label="SAVE"
                  size="sm"
                />
              </div>
            }
          >
            {/* Hex Digest Box */}
            <div className="space-y-2">
              <div className="relative">
                <div
                  className="w-full p-3 bg-[#080B0A] border border-[#28342D] font-mono text-xs text-[#B7F397] break-all leading-relaxed min-h-[96px] select-all selection:bg-[#667653]/40"
                  tabIndex={0}
                  aria-label="Hexadecimal Digest Output"
                >
                  {resultHex || (
                    <span className="text-[#667653] italic">No digest generated yet.</span>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono pt-1">
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">BIT LENGTH:</span>
                  <span className="text-[#E4E9E3]">{resultBits} bits</span>
                </div>
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">BYTE LENGTH:</span>
                  <span className="text-[#E4E9E3]">{resultBytes} bytes</span>
                </div>
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">COMPUTE TIME:</span>
                  <span className="text-[#A3B18A]">{elapsedMs.toFixed(2)} ms</span>
                </div>
              </div>

              {error && (
                <div className="p-2 bg-[#E05D5D]/10 border border-[#E05D5D]/40 text-[#E05D5D] text-xs font-mono">
                  {error}
                </div>
              )}
            </div>

            {/* Reference Digest Comparison */}
            <div className="space-y-2 pt-3 border-t border-[#28342D]">
              <div className="flex items-center justify-between">
                <label htmlFor="reference-hash-input" className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                  COMPARE WITH REFERENCE HASH:
                </label>
                {referenceInput && (
                  <button
                    type="button"
                    onClick={() => setReferenceInput('')}
                    className="text-[10px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              <input
                id="reference-hash-input"
                type="text"
                value={referenceInput}
                onChange={(e) => setReferenceInput(e.target.value)}
                placeholder={`Paste expected ${expectedLength}-character hex digest to verify...`}
                className="w-full p-2 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3]"
              />

              {referenceInput.trim() && (
                <div className="space-y-2">
                  {!isReferenceLengthValid ? (
                    <div className="p-2 bg-[#E5AE54]/10 border border-[#E5AE54]/30 text-[#E5AE54] text-[11px] font-mono flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        Length mismatch: Expected {expectedLength} chars, but reference has {referenceInput.trim().length} chars.
                      </span>
                    </div>
                  ) : isExactMatch ? (
                    <div className="p-2 bg-[#B7F397]/10 border border-[#B7F397]/40 text-[#B7F397] text-[11px] font-mono flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>DIGESTS MATCH: Exact 100% bit-for-bit correspondence.</span>
                    </div>
                  ) : (
                    <div className="p-2 bg-[#E05D5D]/10 border border-[#E05D5D]/30 text-[#E05D5D] text-[11px] font-mono space-y-1">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>DIGEST MISMATCH: {diff?.diffChars} of {diff?.totalChars} characters differ ({diff?.diffPercentage}% change).</span>
                      </div>
                      <p className="text-[10px] text-[#8A968D]">
                        The avalanche effect causes slight input alterations to produce radical differences in output digests.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DataPanel>
        </div>
      </div>
    </div>
  );
};
