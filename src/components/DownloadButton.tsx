import React, { useState } from 'react';
import { Download, Check } from 'lucide-react';

interface DownloadButtonProps {
  content: string | Uint8Array;
  filename: string;
  mimeType?: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  content,
  filename,
  mimeType = 'text/plain;charset=utf-8',
  label = 'DOWNLOAD',
  className = '',
  size = 'md',
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!content) return;

    try {
      const blob = content instanceof Uint8Array
        ? new Blob([content as unknown as BlobPart], { type: mimeType })
        : new Blob([content], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={!content || (typeof content === 'string' && content.length === 0)}
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
        isSmall ? 'text-xs px-2 py-1' : 'text-xs px-2.5 py-1.5'
      } ${
        downloaded
          ? 'bg-[#B7F397]/20 text-[#B7F397] border border-[#B7F397]/50'
          : 'bg-[#17201B] hover:bg-[#28342D] text-[#A3B18A] hover:text-[#E4E9E3] border border-[#28342D]'
      } ${className}`}
      title={`Download as ${filename}`}
    >
      {downloaded ? <Check className="w-3.5 h-3.5 text-[#B7F397]" /> : <Download className="w-3.5 h-3.5" />}
      <span>{downloaded ? 'SAVED' : label}</span>
    </button>
  );
};
