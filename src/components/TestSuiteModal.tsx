import React, { useState, useEffect } from 'react';
import { X, CheckSquare, RefreshCw, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { runCryptographicTestSuite, TestResult } from '../lib/test-vectors';

interface TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestSuiteModal: React.FC<TestSuiteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runDurationMs, setRunDurationMs] = useState(0);

  const executeSuite = async () => {
    setIsRunning(true);
    const start = performance.now();
    try {
      const suiteResults = await runCryptographicTestSuite();
      setResults(suiteResults);
    } catch (err) {
      console.error('Self-test execution failure:', err);
    } finally {
      setRunDurationMs(Number((performance.now() - start).toFixed(2)));
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen && results.length === 0) {
      executeSuite();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const allPassed = totalCount > 0 && passedCount === totalCount;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#111815] border border-[#28342D] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D1210] border-b border-[#28342D]">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-4 h-4 text-[#B7F397]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E4E9E3]">
              Workstation Cryptographic Self-Test Suite
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8A968D] hover:text-[#E4E9E3] p-1 cursor-pointer"
            title="Close test suite"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="px-5 py-3 bg-[#080B0A] border-b border-[#28342D] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            {isRunning ? (
              <span className="text-[#E5AE54] flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                EXECUTING ASSERTIONS...
              </span>
            ) : allPassed ? (
              <span className="text-[#B7F397] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F397]" />
                ALL {totalCount} CRYPTOGRAPHIC ASSERTIONS PASSED ({runDurationMs}ms)
              </span>
            ) : (
              <span className="text-[#E05D5D] flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-[#E05D5D]" />
                {totalCount - passedCount} ASSERTIONS FAILED ({runDurationMs}ms)
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={executeSuite}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
            <span>RE-RUN TEST SUITE</span>
          </button>
        </div>

        {/* Test List */}
        <div className="p-5 overflow-y-auto space-y-3 font-mono text-xs divide-y divide-[#28342D]/40">
          {results.map((test) => (
            <div key={test.id} className="pt-3 first:pt-0 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F397] shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-[#E05D5D] shrink-0" />
                  )}
                  <span className="text-[#E4E9E3] font-semibold">{test.name}</span>
                </div>
                <span className="text-[10px] text-[#667653] uppercase border border-[#28342D] px-1.5 py-0.2 shrink-0">
                  {test.category}
                </span>
              </div>

              {test.notes && (
                <p className="text-[11px] text-[#8A968D] pl-5">
                  {test.notes}
                </p>
              )}

              <div className="pl-5 grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                <div className="p-1.5 bg-[#080B0A] border border-[#28342D]/60 break-all">
                  <span className="text-[#667653] block">EXPECTED:</span>
                  <span className="text-[#8A968D]">{test.expected}</span>
                </div>
                <div className="p-1.5 bg-[#080B0A] border border-[#28342D]/60 break-all">
                  <span className="text-[#667653] block">ACTUAL:</span>
                  <span className={test.passed ? 'text-[#B7F397]' : 'text-[#E05D5D]'}>
                    {test.actual}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0D1210] border-t border-[#28342D] flex items-center justify-between text-[11px] font-mono text-[#8A968D]">
          <span>Grounded in FIPS PUB 180-4 and RFC 4648 specifications.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 text-xs text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
};
