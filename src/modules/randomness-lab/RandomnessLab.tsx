import React, { useState, useEffect } from 'react';
import { OperationRecord } from '../../types';
import { generateSecureRandomBytes, computeByteHistogram, HistogramResult } from '../../lib/random';
import { bytesToHex, bytesToBase64, bytesToBinary } from '../../lib/encoding';
import { DataPanel } from '../../components/DataPanel';
import { CopyButton } from '../../components/CopyButton';
import { DownloadButton } from '../../components/DownloadButton';
import {
  Dices,
  RefreshCw,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Cpu,
} from 'lucide-react';

interface RandomnessLabProps {
  onLogOperation: (record: Omit<OperationRecord, 'id' | 'timestamp'>) => void;
}

type RandomDisplayFormat = 'hex' | 'base64' | 'binary' | 'array';

const PRESET_LENGTHS = [
  { bytes: 16, bits: 128, label: '16 Bytes (128-bit)', desc: 'AES-128 key / UUIDv4' },
  { bytes: 32, bits: 256, label: '32 Bytes (256-bit)', desc: 'AES-256 key / SHA-256 seed' },
  { bytes: 64, bits: 512, label: '64 Bytes (512-bit)', desc: 'Ed25519 signature seed' },
  { bytes: 128, bits: 1024, label: '128 Bytes (1024-bit)', desc: 'High-entropy sample pool' },
  { bytes: 256, bits: 2048, label: '256 Bytes (2048-bit)', desc: 'Large statistical sample' },
];

export const RandomnessLab: React.FC<RandomnessLabProps> = ({ onLogOperation }) => {
  const [selectedBytes, setSelectedBytes] = useState<number>(32);
  const [outputFormat, setOutputFormat] = useState<RandomDisplayFormat>('hex');
  const [rawSample, setRawSample] = useState<Uint8Array>(new Uint8Array(0));
  const [histogram, setHistogram] = useState<HistogramResult | null>(null);
  const [showEducational, setShowEducational] = useState(false);

  const handleGenerate = (length = selectedBytes) => {
    try {
      const bytes = generateSecureRandomBytes(length);
      setRawSample(bytes);
      const hist = computeByteHistogram(bytes);
      setHistogram(hist);

      onLogOperation({
        type: 'random',
        algorithmOrFormat: `CSPRNG (${length} Bytes)`,
        status: 'success',
        details: `${length * 8}-bit entropy generated`,
        outputSizeLabel: `${length} bytes`,
      });
    } catch (err) {
      console.error('CSPRNG generation error:', err);
      onLogOperation({
        type: 'random',
        algorithmOrFormat: `CSPRNG (${length} Bytes)`,
        status: 'failure',
        details: err instanceof Error ? err.message : 'Generator failed',
      });
    }
  };

  // Generate initial sample on mount
  useEffect(() => {
    handleGenerate(32);
  }, []);

  const getFormattedOutput = (): string => {
    if (rawSample.length === 0) return '';
    switch (outputFormat) {
      case 'hex':
        return bytesToHex(rawSample);
      case 'base64':
        return bytesToBase64(rawSample);
      case 'binary':
        return bytesToBinary(rawSample, true);
      case 'array':
        return `[${Array.from(rawSample).join(', ')}]`;
    }
  };

  const formattedOutput = getFormattedOutput();

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Dices className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              RANDOMNESS LAB
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Generate cryptographically secure random bytes via hardware-backed CSPRNG. Inspect real sample distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEducational(!showEducational)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer self-start md:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showEducational ? 'HIDE GUIDE' : 'CSPRNG VS PRNG'}</span>
          {showEducational ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Educational Guide */}
      {showEducational && (
        <div className="bg-[#111815] border border-[#28342D] p-5 space-y-4 text-xs font-mono text-[#8A968D]">
          <div className="flex items-center justify-between border-b border-[#28342D] pb-2">
            <span className="text-[#E4E9E3] font-bold uppercase tracking-wider">
              Entropy & Random Number Generation Standards
            </span>
            <span className="text-[10px] text-[#A3B18A]">RFC 4086 / NIST SP 800-90A</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#A3B18A] font-semibold uppercase">Hardware CSPRNG Pool</h3>
              <p className="text-[11px] leading-relaxed">
                Uses <code className="text-[#E4E9E3]">crypto.getRandomValues()</code> backed by operating system entropy (hardware interrupts, thermal noise, CPU RDRAND instructions).
              </p>
            </div>
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#E5AE54] font-semibold uppercase">Sampling Variation Notice</h3>
              <p className="text-[11px] leading-relaxed">
                Small sample sizes (e.g. 32 or 64 bytes) will naturally not cover all 256 byte values uniformly. This variance is mathematically expected and does not indicate poor cryptographic quality.
              </p>
            </div>
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#E05D5D] font-semibold uppercase">Math.random() Danger</h3>
              <p className="text-[11px] leading-relaxed">
                Standard <code className="text-[#E4E9E3]">Math.random()</code> is completely deterministic and predictable. Never use Math.random() for security keys, salts, tokens, or IDs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Configuration & Generation (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <DataPanel title="Entropy Pool Generator" subtitle="Select Byte Length">
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1.5">
                {PRESET_LENGTHS.map((preset) => {
                  const isSelected = selectedBytes === preset.bytes;
                  return (
                    <button
                      key={preset.bytes}
                      type="button"
                      onClick={() => {
                        setSelectedBytes(preset.bytes);
                        handleGenerate(preset.bytes);
                      }}
                      className={`w-full text-left p-2.5 border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#667653]/30 border-[#B7F397] text-[#E4E9E3]'
                          : 'bg-[#17201B] border-[#28342D] text-[#8A968D] hover:text-[#E4E9E3] hover:bg-[#28342D]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{preset.label}</span>
                        <span className="text-[10px] text-[#A3B18A]">{preset.bits} bits</span>
                      </div>
                      <div className="text-[10px] text-[#8A968D] mt-0.5">{preset.desc}</div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => handleGenerate(selectedBytes)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 px-3 bg-[#667653] hover:bg-[#A3B18A] text-[#080B0A] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>GENERATE FRESH SAMPLE</span>
              </button>

              <div className="pt-2 text-[10px] text-[#8A968D] flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-[#B7F397]" />
                <span>Source: Native browser crypto.getRandomValues()</span>
              </div>
            </div>
          </DataPanel>
        </div>

        {/* Right: Output Inspection & Real Histogram (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Formatted Output Panel */}
          <DataPanel
            title="Generated Cryptographic Sample"
            subtitle={`${rawSample.length} bytes · ${rawSample.length * 8} bits`}
            headerAction={
              <div className="flex items-center gap-2">
                <CopyButton textToCopy={formattedOutput} label="COPY" size="sm" />
                <DownloadButton
                  content={rawSample}
                  filename={`csprng_${rawSample.length}bytes.bin`}
                  mimeType="application/octet-stream"
                  label="SAVE BIN"
                  size="sm"
                />
              </div>
            }
          >
            <div className="space-y-3">
              {/* Output Format Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#080B0A] border border-[#28342D]">
                {(['hex', 'base64', 'binary', 'array'] as RandomDisplayFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setOutputFormat(fmt)}
                    className={`py-1 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                      outputFormat === fmt
                        ? 'bg-[#667653]/30 text-[#B7F397] font-semibold border-b border-[#B7F397]'
                        : 'text-[#8A968D] hover:text-[#E4E9E3]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div
                className="w-full p-3 bg-[#080B0A] border border-[#28342D] font-mono text-xs text-[#B7F397] break-all leading-relaxed max-h-40 overflow-y-auto select-all"
                tabIndex={0}
                aria-label="Random bytes output"
              >
                {formattedOutput}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">TOTAL BYTES:</span>
                  <span className="text-[#E4E9E3]">{rawSample.length} bytes</span>
                </div>
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">ENTROPY BITS:</span>
                  <span className="text-[#E4E9E3]">{rawSample.length * 8} bits</span>
                </div>
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">DISTINCT BYTES:</span>
                  <span className="text-[#B7F397]">{histogram?.distinctByteCount} / 256</span>
                </div>
              </div>
            </div>
          </DataPanel>

          {/* Real Byte Frequency Histogram Panel */}
          {histogram && (
            <DataPanel
              title="Real Sample Byte Distribution Histogram"
              subtitle={`Computed from current ${rawSample.length}-byte sample across 16 byte-range buckets`}
              headerAction={
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8A968D]">
                  <BarChart2 className="w-3.5 h-3.5 text-[#A3B18A]" />
                  <span>Actual Sample Counts</span>
                </div>
              }
            >
              <div className="space-y-4">
                {/* 16 Bins Visualizer */}
                <div className="grid grid-cols-8 sm:grid-cols-16 gap-1 items-end h-28 p-2 bg-[#080B0A] border border-[#28342D]">
                  {histogram.bins.map((bin) => {
                    const maxBinCount = Math.max(...histogram.bins.map(b => b.count), 1);
                    const barHeightPct = Math.max(8, (bin.count / maxBinCount) * 100);

                    return (
                      <div
                        key={bin.rangeLabel}
                        className="flex flex-col items-center justify-end h-full group relative"
                      >
                        <div
                          style={{ height: `${barHeightPct}%` }}
                          className="w-full bg-[#667653] group-hover:bg-[#B7F397] transition-all duration-150 border-t border-[#A3B18A]"
                        />
                        <span className="text-[8px] font-mono text-[#667653] truncate mt-1">
                          {bin.start.toString(16).toUpperCase()}
                        </span>

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:block z-30 p-1.5 bg-[#17201B] border border-[#28342D] text-[10px] font-mono whitespace-nowrap shadow-xl pointer-events-none">
                          <div className="text-[#E4E9E3] font-bold">{bin.rangeLabel}</div>
                          <div className="text-[#B7F397]">Count: {bin.count} bytes</div>
                          <div className="text-[#8A968D]">Share: {bin.percentage}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sampling Analysis Note */}
                <div className="p-3 bg-[#080B0A] border border-[#28342D] text-[11px] font-mono text-[#8A968D] space-y-1">
                  <div className="text-[#E4E9E3] font-semibold flex items-center justify-between">
                    <span>SAMPLING VARIATION ANALYSIS</span>
                    <span className="text-[10px] text-[#A3B18A]">
                      MEAN: {histogram.meanFrequency.toFixed(1)} / byte
                    </span>
                  </div>
                  <p className="leading-relaxed">
                    This histogram is computed strictly from the active {rawSample.length}-byte sample. Visual variation across buckets is natural for finite samples. Cryptographic security is guaranteed by the OS entropy source, not visual distribution uniformity.
                  </p>
                </div>
              </div>
            </DataPanel>
          )}
        </div>
      </div>
    </div>
  );
};
