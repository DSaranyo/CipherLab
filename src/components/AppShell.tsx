import React, { useState } from 'react';
import { NavigationModule } from '../types';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { TestSuiteModal } from './TestSuiteModal';
import { InfoModal } from './InfoModal';
import { Menu } from 'lucide-react';

interface AppShellProps {
  currentModule: NavigationModule;
  onSelectModule: (module: NavigationModule) => void;
  operationCount: number;
  onClearWorkspace: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentModule,
  onSelectModule,
  operationCount,
  onClearWorkspace,
  children,
}) => {
  const [isCompact, setIsCompact] = useState(false);
  const [isSelfTestOpen, setIsSelfTestOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-[#080B0A] text-[#E4E9E3] flex flex-col tactical-grid ${isCompact ? 'text-[13px]' : 'text-sm'}`}>
      {/* Top Header */}
      <TopBar
        currentModule={currentModule}
        isCompact={isCompact}
        onToggleCompact={() => setIsCompact(!isCompact)}
        onOpenSelfTest={() => setIsSelfTestOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Mobile Top Navigation Subheader */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-[#0D1210] border-b border-[#28342D] text-xs font-mono">
        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center gap-2 text-[#A3B18A] hover:text-[#E4E9E3] cursor-pointer"
        >
          <Menu className="w-4 h-4" />
          <span className="uppercase">MODULES</span>
        </button>

        <span className="text-[#8A968D] uppercase truncate">
          {currentModule.replace('-', ' ')}
        </span>
      </div>

      {/* Main Body Layout */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar Rail */}
        <Sidebar
          currentModule={currentModule}
          onSelectModule={onSelectModule}
          operationCount={operationCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Content Viewport */}
        <main className={`flex-1 overflow-y-auto ${isCompact ? 'p-3 md:p-4' : 'p-4 md:p-6 lg:p-8'}`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Operational Footer */}
      <Footer
        operationCount={operationCount}
        onClearWorkspace={onClearWorkspace}
      />

      {/* Modals */}
      <TestSuiteModal
        isOpen={isSelfTestOpen}
        onClose={() => setIsSelfTestOpen(false)}
      />

      <InfoModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};
