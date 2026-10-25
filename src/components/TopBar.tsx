import React from 'react';
import { NavigationModule } from '../types';
import { Shield, Cpu, HelpCircle, CheckSquare, Layers } from 'lucide-react';

interface TopBarProps {
  currentModule: NavigationModule;
  isCompact: boolean;
  onToggleCompact: () => void;
  onOpenSelfTest: () => void;
  onOpenHelp: () => void;
}

const MODULE_TITLES: Record<NavigationModule, string> = {
  overview: 'Mission Overview',
  'hash-studio': 'Hash Studio',
  'encoding-lab': 'Encoding Lab',
  'randomness-lab': 'Randomness Lab',
  'integrity-checker': 'Integrity Checker',
  'crypto-playground': 'Crypto Playground',
  concepts: 'Cryptography Concepts',
  history: 'Operation History',
};

export const TopBar: React.FC<TopBarProps> = ({
  currentModule,
  isCompact,
  onToggleCompact,
  onOpenSelfTest,
  onOpenHelp,
}) => {
  return (
    <header className="h-14 bg-[#0D1210] border-b border-[#28342D] px-4 flex items-center justify-between gap-4 select-none shrink-0 z-20">
      {/* Zone 1: Wordmark & Insignia */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-[#17201B] border border-[#28342D] flex items-center justify-center text-[#A3B18A] relative group">
          <Shield className="w-4 h-4 text-[#B7F397]" />
          <div className="absolute inset-0 bg-[#A3B18A]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-sm font-bold tracking-wider text-[#E4E9E3] whitespace-nowrap">
              CIPHERLAB
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-wider text-[#667653] uppercase whitespace-nowrap">
              Tactical Cryptographic Workstation
            </span>
          </div>
        </div>
      </div>

      {/* Zone 2: Module Breadcrumb & Client-Side Notice */}
      <div className="hidden md:flex items-center gap-3 text-xs font-mono text-[#8A968D] min-w-0">
        <span className="text-[#667653]">LOC:</span>
        <span className="text-[#E4E9E3] font-semibold uppercase tracking-wider truncate">
          {MODULE_TITLES[currentModule]}
        </span>
        <span className="text-[#28342D]">/</span>
        <div className="flex items-center gap-1.5 text-[11px] text-[#A3B18A] px-2 py-0.5 bg-[#17201B] border border-[#28342D]">
          <Cpu className="w-3 h-3 text-[#B7F397]" />
          <span className="whitespace-nowrap">CLIENT-SIDE PROCESSING</span>
          <span className="text-[#667653]">·</span>
          <span className="text-[#8A968D] hidden lg:inline">ZERO BACKEND</span>
        </div>
      </div>

      {/* Zone 3: Operational Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSelfTest}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-[#A3B18A] hover:text-[#E4E9E3] bg-[#111815] hover:bg-[#17201B] border border-[#28342D] transition-colors cursor-pointer"
          title="Run built-in NIST test vector verification suite"
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#B7F397]" />
          <span className="hidden sm:inline whitespace-nowrap">SELF-TEST</span>
        </button>

        <button
          type="button"
          onClick={onToggleCompact}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium border transition-colors cursor-pointer ${
            isCompact
              ? 'bg-[#667653]/30 text-[#B7F397] border-[#667653]'
              : 'bg-[#111815] text-[#8A968D] hover:text-[#E4E9E3] border-[#28342D] hover:bg-[#17201B]'
          }`}
          title={isCompact ? 'Switch to Standard Density' : 'Switch to High Density'}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden xl:inline whitespace-nowrap">{isCompact ? 'COMPACT' : 'DENSITY'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenHelp}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono font-medium text-[#8A968D] hover:text-[#E4E9E3] bg-[#111815] hover:bg-[#17201B] border border-[#28342D] transition-colors cursor-pointer"
          title="About CipherLab architecture and security constraints"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline whitespace-nowrap">INFO</span>
        </button>
      </div>
    </header>
  );
};
