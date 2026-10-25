import React from 'react';

interface DataPanelProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  statusBadge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const DataPanel: React.FC<DataPanelProps> = ({
  title,
  subtitle,
  headerAction,
  statusBadge,
  children,
  className = '',
  bodyClassName = 'p-4',
}) => {
  return (
    <section className={`bg-[#111815] border border-[#28342D] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0D1210] border-b border-[#28342D]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-1.5 h-3 bg-[#667653] shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E4E9E3] truncate">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-[#8A968D] truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {statusBadge}
          {headerAction}
        </div>
      </div>

      <div className={bodyClassName}>
        {children}
      </div>
    </section>
  );
};
