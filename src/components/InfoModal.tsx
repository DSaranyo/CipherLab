import React from 'react';
import { X, Shield, Lock, Eye, Cpu, Database } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#111815] border border-[#28342D] max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0D1210] border-b border-[#28342D]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#B7F397]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E4E9E3]">
              Workstation Architecture & Security Policy
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8A968D] hover:text-[#E4E9E3] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#8A968D] leading-relaxed">
          <div className="p-3 bg-[#080B0A] border border-[#28342D] space-y-1">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E4E9E3]">
              CIPHERLAB — Tactical Cryptographic Workstation
            </h3>
            <p className="text-[11px] text-[#A3B18A] font-mono">
              Tagline: &quot;Cryptography, made observable.&quot;
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E4E9E3] flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#B7F397]" />
              Client-Side Processing Guarantee
            </h4>
            <p>
              CipherLab executes all cryptographic algorithms entirely within your web browser sandbox using the W3C Web Cryptography API (<code className="text-[#A3B18A]">crypto.subtle.digest</code>) and hardware-backed CSPRNG (<code className="text-[#A3B18A]">crypto.getRandomValues</code>).
            </p>
            <p>
              Your plaintexts, files, keys, and digests are never transmitted to any remote backend, cloud server, or machine-learning model.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E4E9E3] flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#A3B18A]" />
              Zero-Persistence Audit Logging
            </h4>
            <p>
              The workstation maintains an ephemeral in-memory operation log exclusively during your current tab session. To maintain strict operational hygiene:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#E4E9E3]">
              <li>Never stores sensitive plaintexts, keys, or file payloads.</li>
              <li>Only logs non-sensitive metadata (timestamps, algorithms, sizes, durations).</li>
              <li>Automatically clears upon closing the browser tab or clicking Clear Session.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#E4E9E3] flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#E5AE54]" />
              Engineering & Aesthetic Context
            </h4>
            <p>
              The military-inspired interface and dark tactical palette are deliberate visual design choices modeled after defense cyber operations centers and security research tools. CipherLab is an educational cybersecurity workstation and makes no claim of governmental classification or military certification.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 bg-[#0D1210] border-t border-[#28342D] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono font-medium text-[#E4E9E3] bg-[#17201B] hover:bg-[#28342D] border border-[#28342D] cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
