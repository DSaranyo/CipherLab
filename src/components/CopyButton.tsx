import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  label = 'COPY',
  copiedLabel = 'COPIED',
  className = '',
  size = 'md',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textToCopy) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={!textToCopy}
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
        isSmall ? 'text-xs px-2 py-1' : 'text-xs px-2.5 py-1.5'
      } ${
        copied
          ? 'bg-[#B7F397]/20 text-[#B7F397] border border-[#B7F397]/50'
          : 'bg-[#17201B] hover:bg-[#28342D] text-[#A3B18A] hover:text-[#E4E9E3] border border-[#28342D]'
      } ${className}`}
      title={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#B7F397]" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
};
