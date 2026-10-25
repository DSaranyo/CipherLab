import React, { useState, useEffect } from 'react';
import { SupportedEncoding, OperationRecord } from '../../types';
import {
  convertRepresentation,
  validateEncodingInput,
  textToBytes,
  bytesToHex,
  bytesToBase64,
  bytesToBinary,
} from '../../lib/encoding';
import { DataPanel } from '../../components/DataPanel';
import { CopyButton } from '../../components/CopyButton';
import { DownloadButton } from '../../components/DownloadButton';
import {
  Binary,
  ArrowRightLeft,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EncodingLabProps {
  onLogOperation: (record: Omit<OperationRecord, 'id' | 'timestamp'>) => void;
}

const PRESET_EXAMPLES: Record<SupportedEncoding, string> = {
  utf8: 'CipherLab • Secure Tactical Operations 2026',
  hex: '4369706865724c616220e280a220536563757265',
  base64: 'Q2lwaGVyTGFiIOKAoiBTZWN1cmU=',
  binary: '01000011 01101001 01110000 01101000 01100101 01110010',
};

const FORMAT_LABELS: Record<SupportedEncoding, { name: string; desc: string }> = {
  utf8: { name: 'UTF-8 Text', desc: 'Standard Unicode string representation' },
  hex: { name: 'Hexadecimal', desc: 'Base-16 notation (2 hex chars per byte)' },
  base64: { name: 'Base64 (RFC 4648)', desc: 'Radix-64 encoding for ASCII transmission' },
  binary: { name: 'Binary (8-bit)', desc: 'Raw 8-bit octet strings (0s and 1s)' },
};

export const EncodingLab: React.FC<EncodingLabProps> = ({ onLogOperation }) => {
  const [fromFormat, setFromFormat] = useState<SupportedEncoding>('utf8');
  const [toFormat, setToFormat] = useState<SupportedEncoding>('hex');
  const [inputText, setInputText] = useState<string>(PRESET_EXAMPLES.utf8);
  const [outputText, setOutputText] = useState<string>('');
  const [byteCount, setByteCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showEducational, setShowEducational] = useState(false);

  // Synchronous representation conversion
  useEffect(() => {
    if (!inputText || inputText.trim() === '') {
      setOutputText('');
      setByteCount(0);
      setError(null);
      return;
    }

    const validation = validateEncodingInput(inputText, fromFormat);
    if (!validation.valid) {
      setError(validation.error || 'Invalid input encoding structure.');
      setOutputText('');
      setByteCount(0);
      return;
    }

    try {
      const result = convertRepresentation(inputText, fromFormat, toFormat);
      setOutputText(result.output);
      setByteCount(result.byteCount);
      setError(null);

      onLogOperation({
        type: 'encode',
        algorithmOrFormat: `${fromFormat.toUpperCase()} → ${toFormat.toUpperCase()}`,
        status: 'success',
        details: `${result.byteCount} bytes converted`,
        inputSizeLabel: `${inputText.length} chars`,
        outputSizeLabel: `${result.output.length} chars (${result.byteCount} bytes)`,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Conversion error occurred.';
      setError(msg);
      setOutputText('');
    }
  }, [inputText, fromFormat, toFormat]);

  const handleSwapFormats = () => {
    // If output exists and is valid, load it as new input
    if (outputText && !error) {
      const prevOutput = outputText;
      const prevFrom = fromFormat;
      const prevTo = toFormat;
      setFromFormat(prevTo);
      setToFormat(prevFrom);
      setInputText(prevOutput);
    } else {
      const prevFrom = fromFormat;
      setFromFormat(toFormat);
      setToFormat(prevFrom);
    }
  };

  const handleLoadPreset = (format: SupportedEncoding) => {
    setFromFormat(format);
    setInputText(PRESET_EXAMPLES[format]);
  };

  // Intermediate bytes for multi-representation inspection
  let intermediateBytes: Uint8Array = new Uint8Array(0);
  try {
    if (inputText && !error) {
      intermediateBytes = convertRepresentation(inputText, fromFormat, 'hex').bytes;
    }
  } catch {
    intermediateBytes = new Uint8Array(0);
  }

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Binary className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              ENCODING LAB
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Lossless data representation converter across UTF-8, Hexadecimal, Base64, and Binary formats.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEducational(!showEducational)}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer self-start md:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showEducational ? 'HIDE GUIDE' : 'ENCODING VS ENCRYPTION'}</span>
          {showEducational ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Educational Callout */}
      {showEducational && (
        <div className="bg-[#111815] border border-[#28342D] p-5 space-y-4 text-xs font-mono text-[#8A968D]">
          <div className="flex items-center justify-between border-b border-[#28342D] pb-2">
            <span className="text-[#E4E9E3] font-bold uppercase tracking-wider">
              Fundamental Principles: Encoding vs Encryption vs Hashing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#A3B18A] font-semibold uppercase">Encoding (Representation)</h3>
              <p className="text-[11px] leading-relaxed">
                Transforms data into a different format for transport or storage (e.g. Hex, Base64). Requires <strong>NO secret key</strong>. Anyone can decode it. <em>Zero confidentiality provided.</em>
              </p>
            </div>
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#E5AE54] font-semibold uppercase">Encryption (Confidentiality)</h3>
              <p className="text-[11px] leading-relaxed">
                Transforms plaintext into ciphertext using a secret key. Reversible <strong>ONLY by authorized keyholders</strong>. Protects sensitive secrets against unauthorized disclosure.
              </p>
            </div>
            <div className="space-y-1.5 p-3 bg-[#080B0A] border border-[#28342D]">
              <h3 className="text-[#E05D5D] font-semibold uppercase">Base64 Is Not Security</h3>
              <p className="text-[11px] leading-relaxed">
                Never obfuscate passwords or tokens with Base64 or Hex. Obfuscation is not security; standard parsers reconstruct the raw plaintext in microseconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Flow Diagram */}
      <div className="p-3 bg-[#0D1210] border border-[#28342D] font-mono text-xs flex flex-wrap items-center justify-center gap-3 text-center">
        <span className="px-2 py-1 bg-[#17201B] border border-[#28342D] text-[#E4E9E3]">
          {FORMAT_LABELS[fromFormat].name}
        </span>
        <span className="text-[#667653]">→</span>
        <span className="px-2 py-1 bg-[#17201B] border border-[#A3B18A]/40 text-[#B7F397]">
          RAW UTF-8 OCTET BYTES ({byteCount} B)
        </span>
        <span className="text-[#667653]">→</span>
        <span className="px-2 py-1 bg-[#17201B] border border-[#28342D] text-[#E4E9E3]">
          {FORMAT_LABELS[toFormat].name}
        </span>
      </div>

      {/* Main Conversion Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Source Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <DataPanel
            title="Source Data Input"
            subtitle={FORMAT_LABELS[fromFormat].name}
            className="h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-4"
            headerAction={
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-[11px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>CLEAR</span>
              </button>
            }
          >
            <div className="space-y-2 flex-1 flex flex-col">
              {/* Format Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#080B0A] border border-[#28342D]">
                {(['utf8', 'hex', 'base64', 'binary'] as SupportedEncoding[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => {
                      setFromFormat(fmt);
                      // Clear error when switching format
                      setError(null);
                    }}
                    className={`py-1 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                      fromFormat === fmt
                        ? 'bg-[#667653]/30 text-[#B7F397] font-semibold border-b border-[#B7F397]'
                        : 'text-[#8A968D] hover:text-[#E4E9E3]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Enter valid ${fromFormat.toUpperCase()} input...`}
                rows={7}
                className="w-full flex-1 p-3 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3] resize-none"
              />

              <div className="flex items-center justify-between text-[11px] font-mono text-[#8A968D] px-1">
                <span>
                  Length: <strong className="text-[#E4E9E3] font-normal">{inputText.length}</strong> chars
                </span>
                {fromFormat === 'utf8' && (
                  <span>
                    UTF-8 Bytes: <strong className="text-[#E4E9E3] font-normal">{textToBytes(inputText).length}</strong>
                  </span>
                )}
              </div>

              {error && (
                <div className="p-2 bg-[#E05D5D]/10 border border-[#E05D5D]/40 text-[#E05D5D] text-[11px] font-mono flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-2 border-t border-[#28342D]/60">
              <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                LOAD SAMPLE INPUT:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['utf8', 'hex', 'base64', 'binary'] as SupportedEncoding[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => handleLoadPreset(fmt)}
                    className="px-2 py-1 text-[10px] font-mono bg-[#17201B] hover:bg-[#28342D] text-[#A3B18A] hover:text-[#E4E9E3] border border-[#28342D] cursor-pointer uppercase"
                  >
                    Sample {fmt}
                  </button>
                ))}
              </div>
            </div>
          </DataPanel>
        </div>

        {/* Center Swap Controls */}
        <div className="lg:col-span-2 flex flex-col justify-center items-center gap-3">
          <button
            type="button"
            onClick={handleSwapFormats}
            className="flex items-center gap-2 p-3 bg-[#17201B] hover:bg-[#28342D] text-[#A3B18A] hover:text-[#B7F397] border border-[#28342D] transition-colors cursor-pointer group"
            title="Swap Source & Target Encodings"
          >
            <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-xs font-mono font-bold">SWAP</span>
          </button>
          <span className="text-[10px] font-mono text-[#667653] text-center">
            Lossless roundtrip
          </span>
        </div>

        {/* Target Panel */}
        <div className="lg:col-span-5 flex flex-col">
          <DataPanel
            title="Converted Output"
            subtitle={FORMAT_LABELS[toFormat].name}
            className="h-full flex flex-col"
            bodyClassName="p-4 flex-1 flex flex-col justify-between space-y-4"
            headerAction={
              <div className="flex items-center gap-2">
                <CopyButton textToCopy={outputText} label="COPY" size="sm" />
                <DownloadButton
                  content={outputText}
                  filename={`converted_${toFormat}.txt`}
                  label="SAVE"
                  size="sm"
                />
              </div>
            }
          >
            <div className="space-y-2 flex-1 flex flex-col">
              {/* Target Format Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-[#080B0A] border border-[#28342D]">
                {(['utf8', 'hex', 'base64', 'binary'] as SupportedEncoding[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setToFormat(fmt)}
                    className={`py-1 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                      toFormat === fmt
                        ? 'bg-[#667653]/30 text-[#B7F397] font-semibold border-b border-[#B7F397]'
                        : 'text-[#8A968D] hover:text-[#E4E9E3]'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <div
                className="w-full flex-1 p-3 bg-[#080B0A] border border-[#28342D] font-mono text-xs text-[#B7F397] break-all leading-relaxed min-h-[160px] select-all overflow-y-auto"
                tabIndex={0}
                aria-label="Converted Output"
              >
                {outputText || (
                  <span className="text-[#667653] italic">
                    {error ? 'Conversion halted due to input format error.' : 'Awaiting input data...'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">RAW BYTE COUNT:</span>
                  <span className="text-[#E4E9E3]">{byteCount} bytes</span>
                </div>
                <div className="p-1.5 bg-[#17201B] border border-[#28342D]">
                  <span className="text-[#667653] block">BIT EQUIVALENT:</span>
                  <span className="text-[#E4E9E3]">{byteCount * 8} bits</span>
                </div>
              </div>
            </div>

            {/* Multi-Representation Preview */}
            {intermediateBytes.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-[#28342D]">
                <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
                  INSTANT MULTI-FORMAT PREVIEW:
                </div>
                <div className="space-y-1 text-[10px] font-mono bg-[#080B0A] p-2 border border-[#28342D]">
                  <div className="truncate">
                    <span className="text-[#667653] mr-1.5">HEX:</span>
                    <span className="text-[#A3B18A]">{bytesToHex(intermediateBytes).substring(0, 48)}...</span>
                  </div>
                  <div className="truncate">
                    <span className="text-[#667653] mr-1.5">B64:</span>
                    <span className="text-[#A3B18A]">{bytesToBase64(intermediateBytes).substring(0, 40)}...</span>
                  </div>
                  <div className="truncate">
                    <span className="text-[#667653] mr-1.5">BIN:</span>
                    <span className="text-[#A3B18A]">{bytesToBinary(intermediateBytes.slice(0, 4), true)}...</span>
                  </div>
                </div>
              </div>
            )}
          </DataPanel>
        </div>
      </div>
    </div>
  );
};
