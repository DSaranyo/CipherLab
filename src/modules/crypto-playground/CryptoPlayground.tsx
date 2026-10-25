import React, { useState, useEffect } from 'react';
import { SupportedHashAlgo, OperationRecord } from '../../types';
import { computeHash, computeHashDiff } from '../../lib/crypto';
import { DataPanel } from '../../components/DataPanel';
import {
  Zap,
  RotateCcw,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface CryptoPlaygroundProps {
  onLogOperation: (record: Omit<OperationRecord, 'id' | 'timestamp'>) => void;
}

const PLAYGROUND_PRESETS = [
  {
    name: 'Case Sensitivity',
    desc: '1-bit ASCII change (h vs H)',
    inputA: 'hello',
    inputB: 'Hello',
  },
  {
    name: 'Single Character Append',
    desc: 'Appended exclamation mark',
    inputA: 'hello',
    inputB: 'hello!',
  },
  {
    name: 'Single Digit Substitution',
    desc: 'Adjacent character flip (3 to 4)',
    inputA: 'Password123',
    inputB: 'Password124',
  },
  {
    name: 'Single Letter in Pangram',
    desc: 'dog vs cog in 43-character sentence',
    inputA: 'The quick brown fox jumps over the lazy dog',
    inputB: 'The quick brown fox jumps over the lazy cog',
  },
];

export const CryptoPlayground: React.FC<CryptoPlaygroundProps> = ({ onLogOperation }) => {
  const [algorithm, setAlgorithm] = useState<SupportedHashAlgo>('SHA-256');
  const [inputA, setInputA] = useState('hello');
  const [inputB, setInputB] = useState('Hello');

  const [hashA, setHashA] = useState('');
  const [hashB, setHashB] = useState('');
  const [activeConcept, setActiveConcept] = useState<string | null>('avalanche');

  useEffect(() => {
    let isCurrent = true;

    const computeBoth = async () => {
      try {
        const [resA, resB] = await Promise.all([
          computeHash(algorithm, inputA),
          computeHash(algorithm, inputB),
        ]);

        if (!isCurrent) return;
        setHashA(resA.hex);
        setHashB(resB.hex);

        const diff = computeHashDiff(resA.hex, resB.hex);
        onLogOperation({
          type: 'comparison',
          algorithmOrFormat: algorithm,
          status: 'success',
          details: `Avalanche Diff: ${diff.diffPercentage}% (${diff.diffChars}/${diff.totalChars} chars)`,
          inputSizeLabel: `${inputA.length} vs ${inputB.length} chars`,
          outputSizeLabel: `${diff.diffPercentage}% difference`,
        });
      } catch (err) {
        console.error('Diff computation error:', err);
      }
    };

    computeBoth();

    return () => {
      isCurrent = false;
    };
  }, [algorithm, inputA, inputB]);

  const diff = computeHashDiff(hashA, hashB);

  const handleApplyPreset = (preset: typeof PLAYGROUND_PRESETS[0]) => {
    setInputA(preset.inputA);
    setInputB(preset.inputB);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              CRYPTO PLAYGROUND
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Interactive laboratory for observing the cryptographic avalanche effect and digest dispersion behavior.
          </p>
        </div>

        {/* Algorithm Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111815] border border-[#28342D]">
          {(['SHA-256', 'SHA-384', 'SHA-512'] as SupportedHashAlgo[]).map((algo) => (
            <button
              key={algo}
              type="button"
              onClick={() => setAlgorithm(algo)}
              className={`px-3 py-1 text-xs font-mono transition-colors cursor-pointer ${
                algorithm === algo
                  ? 'bg-[#667653]/30 text-[#B7F397] font-semibold border-b border-[#B7F397]'
                  : 'text-[#8A968D] hover:text-[#E4E9E3]'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
      </div>

      {/* Demonstration Presets */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
          TACTICAL DEMONSTRATION PRESETS:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PLAYGROUND_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-2.5 text-left bg-[#111815] hover:bg-[#17201B] border border-[#28342D] hover:border-[#667653] transition-colors cursor-pointer group"
            >
              <div className="font-mono text-xs font-semibold text-[#A3B18A] group-hover:text-[#B7F397]">
                {preset.name}
              </div>
              <div className="text-[10px] font-mono text-[#8A968D] mt-0.5 truncate">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dual Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input A */}
        <DataPanel
          title="Input Stream A"
          subtitle={`${inputA.length} characters`}
          headerAction={
            <button
              type="button"
              onClick={() => setInputA('')}
              className="text-[11px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          }
        >
          <div className="space-y-2">
            <textarea
              value={inputA}
              onChange={(e) => setInputA(e.target.value)}
              placeholder="Enter input stream A..."
              rows={4}
              className="w-full p-3 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3] resize-none"
            />
          </div>
        </DataPanel>

        {/* Input B */}
        <DataPanel
          title="Input Stream B"
          subtitle={`${inputB.length} characters`}
          headerAction={
            <button
              type="button"
              onClick={() => setInputB('')}
              className="text-[11px] font-mono text-[#8A968D] hover:text-[#E05D5D] cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>CLEAR</span>
            </button>
          }
        >
          <div className="space-y-2">
            <textarea
              value={inputB}
              onChange={(e) => setInputB(e.target.value)}
              placeholder="Enter input stream B..."
              rows={4}
              className="w-full p-3 bg-[#080B0A] border border-[#28342D] focus:border-[#A3B18A] outline-none text-xs font-mono text-[#E4E9E3] resize-none"
            />
          </div>
        </DataPanel>
      </div>

      {/* Avalanche Visual Diff Inspector */}
      <DataPanel
        title="Bit-Level Character Avalanche Inspector"
        subtitle={`Aligned Hexadecimal Comparison (${algorithm})`}
        statusBadge={
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-[#8A968D]">
              Changed: <strong className="text-[#E05D5D] font-bold">{diff.diffChars}</strong> / {diff.totalChars} chars
            </span>
            <span className="px-2 py-0.5 bg-[#17201B] border border-[#28342D] text-[#B7F397] font-bold">
              {diff.diffPercentage}% DIFFERENCE
            </span>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Aligned Hex Comparison with Character Highlighting */}
          <div className="space-y-2 font-mono text-xs">
            <div className="p-3 bg-[#080B0A] border border-[#28342D] space-y-2">
              <div>
                <span className="text-[10px] text-[#667653] uppercase block mb-1">
                  DIGEST A ({algorithm}):
                </span>
                <div className="flex flex-wrap gap-[2px] leading-none select-all">
                  {diff.charDiffs.map((d) => (
                    <span
                      key={`a-${d.index}`}
                      className={`inline-block px-[2px] py-[3px] text-center min-w-[14px] ${
                        d.isMatch
                          ? 'bg-[#B7F397]/15 text-[#B7F397]'
                          : 'bg-[#E05D5D]/20 text-[#E05D5D] border-b border-[#E05D5D]'
                      }`}
                    >
                      {d.charA || ' '}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#28342D]/50">
                <span className="text-[10px] text-[#667653] uppercase block mb-1">
                  DIGEST B ({algorithm}):
                </span>
                <div className="flex flex-wrap gap-[2px] leading-none select-all">
                  {diff.charDiffs.map((d) => (
                    <span
                      key={`b-${d.index}`}
                      className={`inline-block px-[2px] py-[3px] text-center min-w-[14px] ${
                        d.isMatch
                          ? 'bg-[#B7F397]/15 text-[#B7F397]'
                          : 'bg-[#E05D5D]/20 text-[#E05D5D] border-b border-[#E05D5D]'
                      }`}
                    >
                      {d.charB || ' '}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-[#8A968D]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#B7F397]/30 border border-[#B7F397]" />
                  <span>Matching Hex Nibble ({diff.matchChars})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#E05D5D]/30 border border-[#E05D5D]" />
                  <span>Divergent Hex Nibble ({diff.diffChars})</span>
                </span>
              </div>
              <span className="text-[10px] text-[#667653]">
                Strict Avalanche Criterion (SAC): Each output bit changes with p ≈ 0.5
              </span>
            </div>
          </div>

          {/* Observed Result Explanation */}
          <div className="p-3 bg-[#080B0A] border border-[#28342D] text-xs font-mono text-[#8A968D] space-y-1">
            <span className="text-[#E4E9E3] font-semibold block">OBSERVED DIVERGENCE ANALYSIS</span>
            <p className="leading-relaxed text-[11px]">
              {diff.diffPercentage === 0 ? (
                'Both inputs are identical; resulting digests are 100% equivalent.'
              ) : diff.diffPercentage >= 80 ? (
                `A tiny modification between the two input streams caused ${diff.diffPercentage}% of all digest characters to change. This strong divergence illustrates the cryptographic avalanche effect in action.`
              ) : (
                `Observed ${diff.diffPercentage}% character difference. Note that difference percentages vary statistically across sample runs and do not represent a universal security threshold.`
              )}
            </p>
          </div>
        </div>
      </DataPanel>

      {/* Expandable Technical Explanations */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider">
          CRYPTOGRAPHIC PRINCIPLES & ATTRIBUTES:
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 'avalanche',
              title: 'Strict Avalanche Effect (SAC)',
              desc: 'Flipping a single bit in the input causes each output bit to flip with 50% probability, preventing attackers from conducting differential cryptanalysis or gradient optimization attacks.',
            },
            {
              id: 'collision',
              title: 'Collision Resistance',
              desc: 'It must be computationally infeasible to find ANY pair of distinct inputs (x ≠ y) such that hash(x) = hash(y). For SHA-256, collision resistance provides 128-bit security margin against birthday attacks (2^128 operations).',
            },
            {
              id: 'preimage',
              title: 'Preimage & Second-Preimage Resistance',
              desc: 'Given a digest H, it is impossible to reverse-calculate the message m (Preimage). Given m1, it is impossible to construct a second message m2 producing the exact same digest (Second-Preimage).',
            },
            {
              id: 'length',
              title: 'Digest Length & Entropy Bounds',
              desc: 'SHA-256 produces 256 bits (32 bytes), SHA-384 produces 384 bits (48 bytes), and SHA-512 produces 512 bits (64 bytes). Longer digests widen the security threshold against quantum grover search and future computational advances.',
            },
          ].map((item) => {
            const isExpanded = activeConcept === item.id;
            return (
              <div key={item.id} className="bg-[#111815] border border-[#28342D]">
                <button
                  type="button"
                  onClick={() => setActiveConcept(isExpanded ? null : item.id)}
                  className="w-full p-3 flex items-center justify-between text-left font-mono text-xs text-[#E4E9E3] hover:text-[#B7F397] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-[#667653]" />
                    <span className="font-semibold uppercase">{item.title}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#667653]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#667653]" />}
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 text-[11px] font-mono text-[#8A968D] border-t border-[#28342D]/40 pt-2 leading-relaxed">
                    {item.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
