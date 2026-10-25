import React, { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface FooterProps {
  operationCount: number;
  onClearWorkspace: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  operationCount,
  onClearWorkspace,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirmClear = () => {
    onClearWorkspace();
    setShowConfirm(false);
  };

  return (
    <>
      <footer className="h-10 bg-[#080B0A] border-t border-[#28342D] px-4 flex items-center justify-between text-[11px] font-mono text-[#8A968D] select-none shrink-0 z-10">
        <div className="flex items-center gap-3">
          <span className="text-[#A3B18A] font-semibold tracking-wider">
            CIPHERLAB / LOCAL WORKSTATION
          </span>
          <span className="text-[#28342D] hidden sm:inline">|</span>
          <span className="hidden sm:inline text-[#8A968D]">
            Session Operations: <strong className="text-[#E4E9E3] font-normal">{operationCount}</strong>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline text-[10px] text-[#667653]">
            Created as an independent cybersecurity learning project
          </span>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-1.5 text-xs text-[#8A968D] hover:text-[#E05D5D] transition-colors cursor-pointer"
            title="Reset active workstation session memory"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="uppercase tracking-wider">CLEAR SESSION</span>
          </button>
        </div>
      </footer>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#111815] border border-[#28342D] max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-[#E5AE54]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-[#E4E9E3]">
                Confirm Workspace Reset
              </h3>
            </div>
            <p className="text-xs text-[#8A968D] leading-relaxed">
              This will clear the in-memory operation audit log and reset active session states across modules. No data is stored on remote servers.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1.5 text-xs font-mono text-[#8A968D] hover:text-[#E4E9E3] bg-[#17201B] border border-[#28342D] cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                className="px-3 py-1.5 text-xs font-mono font-semibold text-[#080B0A] bg-[#E05D5D] hover:bg-[#E05D5D]/90 border border-[#E05D5D] cursor-pointer"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
