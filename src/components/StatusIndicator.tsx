import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'nominal' | 'active' | 'warning' | 'alert' | 'idle';
  label: string;
  sublabel?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  sublabel,
  className = '',
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'nominal':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5 text-[#B7F397]" />,
          textClass: 'text-[#B7F397]',
          bgClass: 'bg-[#B7F397]/10 border-[#B7F397]/30',
        };
      case 'active':
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#A3B18A]" />,
          textClass: 'text-[#A3B18A]',
          bgClass: 'bg-[#667653]/20 border-[#667653]/40',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5 text-[#E5AE54]" />,
          textClass: 'text-[#E5AE54]',
          bgClass: 'bg-[#E5AE54]/10 border-[#E5AE54]/30',
        };
      case 'alert':
        return {
          icon: <AlertCircle className="w-3.5 h-3.5 text-[#E05D5D]" />,
          textClass: 'text-[#E05D5D]',
          bgClass: 'bg-[#E05D5D]/10 border-[#E05D5D]/30',
        };
      case 'idle':
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-[#8A968D]" />,
          textClass: 'text-[#8A968D]',
          bgClass: 'bg-[#17201B] border-[#28342D]',
        };
    }
  };

  const style = getStatusStyles();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-xs font-mono uppercase tracking-wider ${style.bgClass} ${className}`}>
      {style.icon}
      <span className={style.textClass}>{label}</span>
      {sublabel && <span className="text-[#8A968D] text-[10px] lowercase">({sublabel})</span>}
    </div>
  );
};
