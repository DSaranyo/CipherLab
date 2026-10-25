import React from 'react';
import { NavigationModule, OperationRecord } from '../../types';
import { DataPanel } from '../../components/DataPanel';
import {
  Hash,
  Binary,
  Dices,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Cpu,
  History,
} from 'lucide-react';

interface MissionOverviewProps {
  onNavigate: (module: NavigationModule) => void;
  sessionStats: {
    totalOperations: number;
    hashCount: number;
    encodeCount: number;
    randomCount: number;
    fileCount: number;
    lastHashOp?: OperationRecord;
    lastEncodeOp?: OperationRecord;
    lastRandomOp?: OperationRecord;
    lastIntegrityOp?: OperationRecord;
  };
  recentHistory: OperationRecord[];
}

export const MissionOverview: React.FC<MissionOverviewProps> = ({
  onNavigate,
  sessionStats,
  recentHistory,
}) => {
  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#28342D]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#B7F397]" aria-hidden="true" />
            <h1 className="text-lg font-mono font-bold tracking-wider uppercase text-[#E4E9E3]">
              MISSION OVERVIEW
            </h1>
          </div>
          <p className="text-xs text-[#8A968D]">
            Cryptographic analysis, data transformation, and integrity verification.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#A3B18A] bg-[#111815] border border-[#28342D] px-3 py-1.5 self-start md:self-auto">
          <Cpu className="w-3.5 h-3.5 text-[#B7F397]" />
          <span>LOCAL SANDBOX ACTIVE</span>
          <span className="text-[#667653]">|</span>
          <span className="text-[#8A968D]">ISOLATED EXECUTION</span>
        </div>
      </div>

      {/* Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hashing Card */}
        <div className="bg-[#111815] border border-[#28342D] p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#17201B] border border-[#28342D] text-[#A3B18A]">
                <Hash className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-[#667653] uppercase">
                {sessionStats.hashCount} EXECUTIONS
              </span>
            </div>
            <div>
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E4E9E3]">
                HASHING
              </h2>
              <p className="text-[11px] text-[#8A968D] mt-0.5">
                SHA-256 · SHA-384 · SHA-512
              </p>
            </div>
            <div className="pt-2 border-t border-[#28342D]/60 text-[11px] font-mono">
              <span className="text-[#667653] block text-[10px]">LAST OPERATION:</span>
              {sessionStats.lastHashOp ? (
                <div className="text-[#A3B18A] truncate">
                  {sessionStats.lastHashOp.algorithmOrFormat} ({sessionStats.lastHashOp.details})
                </div>
              ) : (
                <span className="text-[#8A968D]">NO OPERATIONS YET</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('hash-studio')}
            className="mt-4 w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer"
          >
            <span>OPEN HASH STUDIO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Data Encoding Card */}
        <div className="bg-[#111815] border border-[#28342D] p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#17201B] border border-[#28342D] text-[#A3B18A]">
                <Binary className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-[#667653] uppercase">
                {sessionStats.encodeCount} CONVERSIONS
              </span>
            </div>
            <div>
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E4E9E3]">
                DATA ENCODING
              </h2>
              <p className="text-[11px] text-[#8A968D] mt-0.5">
                UTF-8 · HEX · BASE64 · BINARY
              </p>
            </div>
            <div className="pt-2 border-t border-[#28342D]/60 text-[11px] font-mono">
              <span className="text-[#667653] block text-[10px]">LAST CONVERSION:</span>
              {sessionStats.lastEncodeOp ? (
                <div className="text-[#A3B18A] truncate">
                  {sessionStats.lastEncodeOp.algorithmOrFormat} ({sessionStats.lastEncodeOp.details})
                </div>
              ) : (
                <span className="text-[#8A968D]">NO OPERATIONS YET</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('encoding-lab')}
            className="mt-4 w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer"
          >
            <span>ENCODE DATA</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Randomness Card */}
        <div className="bg-[#111815] border border-[#28342D] p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#17201B] border border-[#28342D] text-[#A3B18A]">
                <Dices className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-[#667653] uppercase">
                {sessionStats.randomCount} RUNS
              </span>
            </div>
            <div>
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E4E9E3]">
                RANDOMNESS
              </h2>
              <p className="text-[11px] text-[#8A968D] mt-0.5">
                CSPRNG · 128 - 1024 BITS
              </p>
            </div>
            <div className="pt-2 border-t border-[#28342D]/60 text-[11px] font-mono">
              <span className="text-[#667653] block text-[10px]">CSPRNG STATUS:</span>
              <div className="text-[#B7F397] flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#B7F397]" />
                <span>W3C CRYPTO READY</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('randomness-lab')}
            className="mt-4 w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer"
          >
            <span>GENERATE RANDOM BYTES</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* File Integrity Card */}
        <div className="bg-[#111815] border border-[#28342D] p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[#17201B] border border-[#28342D] text-[#A3B18A]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-[#667653] uppercase">
                {sessionStats.fileCount} CHECKED
              </span>
            </div>
            <div>
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E4E9E3]">
                FILE INTEGRITY
              </h2>
              <p className="text-[11px] text-[#8A968D] mt-0.5">
                LOCAL BROWSER VERIFICATION
              </p>
            </div>
            <div className="pt-2 border-t border-[#28342D]/60 text-[11px] font-mono">
              <span className="text-[#667653] block text-[10px]">FILES PROCESSED:</span>
              {sessionStats.fileCount > 0 ? (
                <div className="text-[#A3B18A] truncate">
                  {sessionStats.fileCount} {sessionStats.fileCount === 1 ? 'file' : 'files'} verified
                </div>
              ) : (
                <span className="text-[#8A968D]">NO FILES PROCESSED</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('integrity-checker')}
            className="mt-4 w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] transition-colors cursor-pointer"
          >
            <span>VERIFY FILE HASH</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Operational Highlights & Session History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Actions & Architecture Notice */}
        <div className="lg:col-span-1 space-y-4">
          <DataPanel title="Tactical Workstation Specs" subtitle="Runtime Environment">
            <div className="space-y-3 font-mono text-xs text-[#8A968D]">
              <div className="flex items-center justify-between py-1.5 border-b border-[#28342D]/60">
                <span className="text-[#667653]">CORE API:</span>
                <span className="text-[#E4E9E3]">crypto.subtle</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#28342D]/60">
                <span className="text-[#667653]">ENTROPY SOURCE:</span>
                <span className="text-[#E4E9E3]">Hardware CSPRNG</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#28342D]/60">
                <span className="text-[#667653]">HASH PRIMITIVES:</span>
                <span className="text-[#E4E9E3]">SHA-2 (256/384/512)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#28342D]/60">
                <span className="text-[#667653]">NETWORK EXFILTRATION:</span>
                <span className="text-[#B7F397]">0 BYTES (BLOCKED)</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#667653]">REMOTE BACKEND:</span>
                <span className="text-[#8A968D]">NONE REQUIRED</span>
              </div>
            </div>
          </DataPanel>

          <DataPanel title="Rapid Workstation Links" subtitle="Interactive Tools">
            <div className="grid grid-cols-1 gap-2 font-mono text-xs">
              <button
                type="button"
                onClick={() => onNavigate('crypto-playground')}
                className="flex items-center justify-between p-2.5 bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] text-[#A3B18A] hover:text-[#E4E9E3] transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="font-semibold">AVALANCHE SIMULATOR</div>
                  <div className="text-[10px] text-[#8A968D]">Inspect bit-diff cascades on modified inputs</div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('concepts')}
                className="flex items-center justify-between p-2.5 bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] text-[#A3B18A] hover:text-[#E4E9E3] transition-colors cursor-pointer text-left"
              >
                <div>
                  <div className="font-semibold">CRYPTOGRAPHY CONCEPTS</div>
                  <div className="text-[10px] text-[#8A968D]">NIST guidelines, KDFs, CSPRNG standards</div>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </DataPanel>
        </div>

        {/* Right: In-Memory Operation History Feed */}
        <div className="lg:col-span-2">
          <DataPanel
            title="Active Session Audit Trail"
            subtitle="Ephemeral In-Memory Operation Log (Non-Sensitive Metadata)"
            headerAction={
              <button
                type="button"
                onClick={() => onNavigate('history')}
                className="text-xs font-mono text-[#A3B18A] hover:text-[#E4E9E3] flex items-center gap-1 cursor-pointer"
              >
                <History className="w-3.5 h-3.5" />
                <span>FULL AUDIT LOG ({sessionStats.totalOperations})</span>
              </button>
            }
          >
            {recentHistory.length === 0 ? (
              <div className="py-12 text-center space-y-3 font-mono">
                <Clock className="w-8 h-8 text-[#667653] mx-auto" />
                <div>
                  <h3 className="text-xs font-semibold uppercase text-[#E4E9E3]">
                    NO RECENT OPERATIONS RECORDED
                  </h3>
                  <p className="text-[11px] text-[#8A968D] max-w-sm mx-auto mt-1">
                    Execute a hash, data encoding, or random generation sequence to inspect live operational telemetry.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('hash-studio')}
                  className="px-3 py-1.5 text-xs text-[#080B0A] font-semibold bg-[#A3B18A] hover:bg-[#B7F397] transition-colors cursor-pointer"
                >
                  START IN HASH STUDIO
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="hidden sm:grid grid-cols-12 gap-2 pb-2 text-[10px] font-mono text-[#667653] border-b border-[#28342D] uppercase">
                  <div className="col-span-3">TIMESTAMP</div>
                  <div className="col-span-2">TYPE</div>
                  <div className="col-span-3">ALGORITHM / FORMAT</div>
                  <div className="col-span-3">DETAILS</div>
                  <div className="col-span-1 text-right">STATUS</div>
                </div>
                <div className="space-y-1.5 divide-y divide-[#28342D]/40">
                  {recentHistory.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="pt-2 first:pt-0 sm:grid sm:grid-cols-12 gap-2 text-xs font-mono items-center py-1"
                    >
                      <div className="sm:col-span-3 text-[11px] text-[#8A968D]">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#17201B] border border-[#28342D] text-[#A3B18A]">
                          {item.type}
                        </span>
                      </div>
                      <div className="sm:col-span-3 text-[#E4E9E3] font-semibold truncate">
                        {item.algorithmOrFormat}
                      </div>
                      <div className="sm:col-span-3 text-[11px] text-[#8A968D] truncate">
                        {item.details}
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <span
                          className={`text-[10px] uppercase font-bold ${
                            item.status === 'success' ? 'text-[#B7F397]' : 'text-[#E05D5D]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DataPanel>
        </div>
      </div>
    </div>
  );
};
