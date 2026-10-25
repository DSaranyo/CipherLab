import React, { useState } from 'react';
import { OperationRecord } from '../../types';
import { DataPanel } from '../../components/DataPanel';
import {
  History,
  Trash2,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from 'lucide-react';

interface OperationHistoryProps {
  history: OperationRecord[];
  onClearHistory: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export const OperationHistory: React.FC<OperationHistoryProps> = ({
  history,
  onClearHistory,
  onExportJSON,
  onExportCSV,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All Operations' },
    { id: 'hash', label: 'Hashing' },
    { id: 'encode', label: 'Encoding' },
    { id: 'random', label: 'Randomness' },
    { id: 'integrity', label: 'Integrity' },
    { id: 'comparison', label: 'Diff / Avalanche' },
  ];

  const filteredHistory = history.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-4 h-4 text-[#B7F397]" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              OPERATION AUDIT LOG
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Ephemeral in-memory transaction record of cryptographic tasks executed during this browser session.
          </p>
        </div>

        {/* Export and Clear Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExportJSON}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#111815] hover:bg-[#17201B] border border-[#28342D] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT JSON</span>
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#111815] hover:bg-[#17201B] border border-[#28342D] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmClear(true)}
            disabled={history.length === 0}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-[#E05D5D] hover:text-white bg-[#111815] hover:bg-[#E05D5D]/20 border border-[#28342D] hover:border-[#E05D5D] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR LOG</span>
          </button>
        </div>
      </div>

      {/* Zero Persistence Privacy Guarantee Banner */}
      <div className="p-3 bg-[#111815] border border-[#28342D] flex items-start gap-3 text-xs font-mono text-[#8A968D]">
        <ShieldAlert className="w-4 h-4 text-[#B7F397] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-[#E4E9E3] font-semibold">Strict Data Minimization Policy</span>
          <p className="text-[11px] leading-relaxed">
            CipherLab never records sensitive plaintext strings, passwords, secret keys, or binary payloads in this log. Only non-sensitive operational telemetry (execution duration, byte counts, algorithms, timestamps) is retained in volatile browser memory.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-[#111815] border border-[#28342D]">
        <div className="px-2.5 py-1 text-[10px] font-mono uppercase text-[#667653] flex items-center gap-1">
          <Filter className="w-3 h-3" />
          <span>FILTER:</span>
        </div>
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setFilterType(opt.id)}
            className={`px-3 py-1 text-xs font-mono uppercase transition-colors cursor-pointer border ${
              filterType === opt.id
                ? 'bg-[#667653]/30 border-[#B7F397] text-[#B7F397] font-semibold'
                : 'bg-[#17201B] border-[#28342D] text-[#8A968D] hover:text-[#E4E9E3]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* History Table */}
      <DataPanel
        title={`Recorded Events (${filteredHistory.length})`}
        subtitle="Chronological descending"
      >
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center space-y-2 font-mono">
            <History className="w-8 h-8 text-[#667653] mx-auto" />
            <div className="text-xs font-semibold text-[#E4E9E3] uppercase">
              NO AUDIT ENTRIES MATCHING CRITERIA
            </div>
            <p className="text-[11px] text-[#8A968D] max-w-sm mx-auto">
              Execute operations in the Hash Studio, Encoding Lab, Randomness Lab, or Integrity Checker to populate this record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#28342D] text-[10px] text-[#667653] uppercase tracking-wider">
                  <th className="pb-2.5 font-semibold">TIMESTAMP</th>
                  <th className="pb-2.5 font-semibold">TYPE</th>
                  <th className="pb-2.5 font-semibold">ALGORITHM / FORMAT</th>
                  <th className="pb-2.5 font-semibold">DETAILS</th>
                  <th className="pb-2.5 font-semibold">SIZE / METRIC</th>
                  <th className="pb-2.5 font-semibold">EXECUTION</th>
                  <th className="pb-2.5 font-semibold text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#28342D]/40">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-[#17201B]/50 transition-colors">
                    <td className="py-2.5 text-[11px] text-[#8A968D] whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 text-[10px] uppercase bg-[#17201B] border border-[#28342D] text-[#A3B18A]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-2.5 text-[#E4E9E3] font-semibold whitespace-nowrap">
                      {item.algorithmOrFormat}
                    </td>
                    <td className="py-2.5 text-[#8A968D] text-[11px] max-w-xs truncate">
                      {item.details}
                    </td>
                    <td className="py-2.5 text-[11px] text-[#8A968D] whitespace-nowrap">
                      {item.outputSizeLabel || item.inputSizeLabel || '—'}
                    </td>
                    <td className="py-2.5 text-[11px] text-[#A3B18A] whitespace-nowrap">
                      {item.durationMs !== undefined ? `${item.durationMs}ms` : '—'}
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                          item.status === 'success' ? 'text-[#B7F397]' : 'text-[#E05D5D]'
                        }`}
                      >
                        {item.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3 text-[#B7F397]" />
                        ) : (
                          <XCircle className="w-3 h-3 text-[#E05D5D]" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataPanel>

      {/* Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111815] border border-[#28342D] max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#E4E9E3]">
              Confirm History Clear
            </h3>
            <p className="text-xs font-mono text-[#8A968D] leading-relaxed">
              Are you sure you want to purge the current in-memory audit log? This operation cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="px-3 py-1.5 text-xs font-mono text-[#8A968D] hover:text-[#E4E9E3] bg-[#17201B] border border-[#28342D] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowConfirmClear(false);
                }}
                className="px-3 py-1.5 text-xs font-mono font-semibold text-[#080B0A] bg-[#E05D5D] hover:bg-[#E05D5D]/90 border border-[#E05D5D] cursor-pointer"
              >
                PURGE LOG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
