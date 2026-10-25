import React, { useState, useRef, useId } from 'react';
import { SupportedHashAlgo, OperationRecord } from '../../types';
import {
  computeFileHash,
  evaluateIntegrityStatus,
  formatByteSize,
  formatChecksumFileContent,
} from '../../lib/file-integrity';
import { HASH_ALGO_METADATA } from '../../lib/crypto';
import { DataPanel } from '../../components/DataPanel';
import { CopyButton } from '../../components/CopyButton';
import { DownloadButton } from '../../components/DownloadButton';
import {
  ShieldCheck,
  UploadCloud,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Lock,
  Cpu,
} from 'lucide-react';

interface IntegrityCheckerProps {
  onLogOperation: (record: Omit<OperationRecord, 'id' | 'timestamp'>) => void;
}

export const IntegrityChecker: React.FC<IntegrityCheckerProps> = ({ onLogOperation }) => {
  const fileInputId = useId();
  const [algorithm, setAlgorithm] = useState<SupportedHashAlgo>('SHA-256');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [computedDigest, setComputedDigest] = useState<string>('');
  const [referenceDigest, setReferenceDigest] = useState<string>('');
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File, targetAlgo = algorithm) => {
    setSelectedFile(file);
    setIsProcessing(true);
    setErrorMessage(null);
    setComputedDigest('');

    try {
      const result = await computeFileHash(file, targetAlgo);
      setComputedDigest(result.computedHash);
      setElapsedMs(result.elapsedMs);

      onLogOperation({
        type: 'integrity',
        algorithmOrFormat: targetAlgo,
        status: 'success',
        details: `${file.name} (${formatByteSize(file.size)})`,
        inputSizeLabel: formatByteSize(file.size),
        outputSizeLabel: `${HASH_ALGO_METADATA[targetAlgo].hexLength} hex chars`,
        durationMs: result.elapsedMs,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to process file.';
      setErrorMessage(msg);
      onLogOperation({
        type: 'integrity',
        algorithmOrFormat: targetAlgo,
        status: 'failure',
        details: msg,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setComputedDigest('');
    setReferenceDigest('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Re-hash if user changes algorithm on loaded file
  const handleAlgorithmChange = (newAlgo: SupportedHashAlgo) => {
    setAlgorithm(newAlgo);
    if (selectedFile) {
      processFile(selectedFile, newAlgo);
    }
  };

  const integrityEvaluation = computedDigest
    ? evaluateIntegrityStatus(computedDigest, referenceDigest, algorithm)
    : null;

  const checksumFileContent = computedDigest && selectedFile
    ? formatChecksumFileContent(computedDigest, selectedFile.name, algorithm)
    : '';

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              INTEGRITY CHECKER
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Browser-native file checksum calculation and verification against vendor-published reference digests.
          </p>
        </div>

        {/* Mandatory Privacy Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111815] border border-[#28342D] text-xs font-mono text-[#A3B18A] self-start md:self-auto">
          <Lock className="w-3.5 h-3.5 text-[#B7F397]" />
          <span>FILE PROCESSING: LOCAL BROWSER</span>
          <span className="text-[#667653]">|</span>
          <span className="text-[#8A968D]">NO UPLOADS</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Drag & Drop File Selector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <DataPanel
            title="Local File Ingestion"
            subtitle="File API Streaming Sandbox"
            headerAction={
              selectedFile && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-[11px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RESET FILE</span>
                </button>
              )
            }
          >
            <div className="space-y-4">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`p-6 border-2 border-dashed transition-colors text-center cursor-pointer flex flex-col items-center justify-center min-h-[170px] ${
                  isDragOver
                    ? 'border-[#B7F397] bg-[#B7F397]/5'
                    : 'border-[#28342D] hover:border-[#667653] bg-[#080B0A]'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  id={fileInputId}
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor={fileInputId} className="sr-only">Choose a file to compute cryptographic hash</label>
                <UploadCloud className="w-8 h-8 text-[#A3B18A] mb-2" />
                <span className="text-xs font-mono font-semibold uppercase text-[#E4E9E3]">
                  {selectedFile ? 'CHOOSE A DIFFERENT FILE' : 'DROP FILE HERE OR BROWSE'}
                </span>
                <span className="text-[10px] font-mono text-[#8A968D] mt-1">
                  Processed entirely in local memory (up to 500 MiB)
                </span>
              </div>

              {/* Algorithm Picker */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                  CHECKSUM ALGORITHM:
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['SHA-256', 'SHA-384', 'SHA-512'] as SupportedHashAlgo[]).map((algo) => (
                    <button
                      key={algo}
                      type="button"
                      onClick={() => handleAlgorithmChange(algo)}
                      className={`py-1.5 px-2 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                        algorithm === algo
                          ? 'bg-[#667653]/30 border-[#B7F397] text-[#B7F397] font-semibold'
                          : 'bg-[#17201B] border-[#28342D] text-[#8A968D] hover:text-[#E4E9E3]'
                      }`}
                    >
                      {algo}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Metadata Card */}
              {selectedFile && (
                <div className="p-3 bg-[#080B0A] border border-[#28342D] space-y-2 font-mono text-xs">
                  <div className="flex items-center gap-2 text-[#E4E9E3] font-semibold truncate">
                    <FileCode className="w-4 h-4 text-[#A3B18A] shrink-0" />
                    <span className="truncate">{selectedFile.name}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8A968D] pt-1 border-t border-[#28342D]/60">
                    <div>
                      <span className="text-[#667653] block">FILE SIZE:</span>
                      <span className="text-[#E4E9E3]">{formatByteSize(selectedFile.size)}</span>
                      <span className="text-[#667653] block">({selectedFile.size.toLocaleString()} bytes)</span>
                    </div>
                    <div>
                      <span className="text-[#667653] block">MIME TYPE:</span>
                      <span className="text-[#E4E9E3] truncate block">{selectedFile.type || 'application/octet-stream'}</span>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-2.5 bg-[#E05D5D]/10 border border-[#E05D5D]/30 text-[#E05D5D] text-xs font-mono flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </DataPanel>
        </div>

        {/* Right: Verification & Digest Result (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <DataPanel
            title="Computed Checksum & Verification"
            subtitle={`${algorithm} Verification Engine`}
            headerAction={
              computedDigest && (
                <div className="flex items-center gap-2">
                  <CopyButton textToCopy={computedDigest} label="COPY" size="sm" />
                  <DownloadButton
                    content={checksumFileContent}
                    filename={`${selectedFile?.name || 'file'}.${algorithm.toLowerCase()}`}
                    label="CHECKSUM FILE"
                    size="sm"
                  />
                </div>
              )
            }
          >
            <div className="space-y-4">
              {/* Computed Digest Display */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                  <span>COMPUTED {algorithm} DIGEST:</span>
                  {elapsedMs > 0 && (
                    <span className="text-[#A3B18A] flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      Calculated in {elapsedMs}ms
                    </span>
                  )}
                </div>

                <div
                  className="w-full p-3 bg-[#080B0A] border border-[#28342D] font-mono text-xs text-[#B7F397] break-all leading-relaxed min-h-[72px] select-all selection:bg-[#667653]/40"
                  tabIndex={0}
                  aria-label="Computed file hash"
                >
                  {isProcessing ? (
                    <span className="text-[#E5AE54] animate-pulse">Computing cryptographic hash over file bytes...</span>
                  ) : computedDigest ? (
                    computedDigest
                  ) : (
                    <span className="text-[#667653] italic">Select or drop a file to compute its checksum.</span>
                  )}
                </div>
              </div>

              {/* Reference Checksum Verification Input */}
              <div className="space-y-2 pt-2 border-t border-[#28342D]">
                <div className="flex items-center justify-between">
                  <label htmlFor="integrity-reference-input" className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                    COMPARE WITH VENDOR REFERENCE CHECKSUM:
                  </label>
                  {referenceDigest && (
                    <button
                      type="button"
                      onClick={() => setReferenceDigest('')}
                      className="text-[10px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer"
                    >
                      CLEAR REFERENCE
                    </button>
                  )}
                </div>

                <input
                  id="integrity-reference-input"
                  type="text"
                  value={referenceDigest}
                  onChange={(e) => setReferenceDigest(e.target.value)}
                  placeholder={`Paste published ${HASH_ALGO_METADATA[algorithm].hexLength}-character ${algorithm} checksum...`}
                  className="w-full p-2.5 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3]"
                />
              </div>

              {/* Verification Status Banner */}
              {integrityEvaluation && computedDigest && (
                <div
                  className={`p-3 border font-mono text-xs space-y-1.5 ${
                    integrityEvaluation.status === 'MATCH'
                      ? 'bg-[#B7F397]/10 border-[#B7F397]/40 text-[#B7F397]'
                      : integrityEvaluation.status === 'MISMATCH'
                      ? 'bg-[#E05D5D]/10 border-[#E05D5D]/40 text-[#E05D5D]'
                      : integrityEvaluation.status === 'INVALID_REFERENCE'
                      ? 'bg-[#E5AE54]/10 border-[#E5AE54]/40 text-[#E5AE54]'
                      : 'bg-[#17201B] border-[#28342D] text-[#8A968D]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider">
                    {integrityEvaluation.status === 'MATCH' && <CheckCircle2 className="w-4 h-4 text-[#B7F397]" />}
                    {integrityEvaluation.status === 'MISMATCH' && <XCircle className="w-4 h-4 text-[#E05D5D]" />}
                    {integrityEvaluation.status === 'INVALID_REFERENCE' && <AlertTriangle className="w-4 h-4 text-[#E5AE54]" />}
                    <span>{integrityEvaluation.statusLabel}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {integrityEvaluation.statusMessage}
                  </p>
                </div>
              )}

              {/* Security Caveat Callout */}
              <div className="p-3 bg-[#080B0A] border border-[#28342D] text-[11px] font-mono text-[#8A968D] space-y-1">
                <span className="text-[#E4E9E3] font-semibold block">INTEGRITY VS AUTHENTICITY NOTICE</span>
                <p className="leading-relaxed">
                  A matching digest proves byte-for-byte consistency between the file and the supplied reference checksum. It does not independently prove vendor authenticity unless the checksum was obtained through a cryptographically signed channel (e.g. GPG/PGP signature or verified TLS certificate).
                </p>
              </div>
            </div>
          </DataPanel>
        </div>
      </div>
    </div>
  );
};
