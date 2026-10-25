import React from 'react';
import { NavigationModule } from '../types';
import {
  LayoutDashboard,
  Hash,
  Binary,
  Dices,
  ShieldCheck,
  Zap,
  BookOpen,
  History,
  Terminal,
} from 'lucide-react';

interface SidebarProps {
  currentModule: NavigationModule;
  onSelectModule: (module: NavigationModule) => void;
  operationCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentModule,
  onSelectModule,
  operationCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const operationsNav: NavItem[] = [
    { id: 'overview', label: 'Mission Overview', icon: LayoutDashboard },
    { id: 'hash-studio', label: 'Hash Studio', icon: Hash },
    { id: 'encoding-lab', label: 'Encoding Lab', icon: Binary },
    { id: 'randomness-lab', label: 'Randomness Lab', icon: Dices },
    { id: 'integrity-checker', label: 'Integrity Checker', icon: ShieldCheck },
    { id: 'crypto-playground', label: 'Crypto Playground', icon: Zap },
  ];

  const referenceNav: NavItem[] = [
    { id: 'concepts', label: 'Crypto Concepts', icon: BookOpen },
    { id: 'history', label: 'Operation History', icon: History, badge: operationCount > 0 ? operationCount : undefined },
  ];

  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentModule === item.id;

        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                onSelectModule(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-mono tracking-wider transition-colors cursor-pointer text-left ${
                isActive
                  ? 'bg-[#667653]/25 text-[#E4E9E3] border-l-2 border-[#B7F397]'
                  : 'text-[#8A968D] hover:text-[#E4E9E3] hover:bg-[#17201B] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-[#B7F397]' : 'text-[#667653]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className="px-1.5 py-0.2 text-[10px] font-mono bg-[#17201B] text-[#A3B18A] border border-[#28342D] shrink-0">
                  {item.badge}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between select-none">
      <div className="p-3 space-y-6">
        <div>
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#667653] font-semibold flex items-center justify-between">
            <span>OPERATIONS</span>
            <Terminal className="w-3 h-3 text-[#667653]" />
          </div>
          {renderNavList(operationsNav)}
        </div>

        <div>
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-widest text-[#667653] font-semibold flex items-center justify-between">
            <span>REFERENCE</span>
          </div>
          {renderNavList(referenceNav)}
        </div>
      </div>

      {/* Hardware / Engine Status Footer Info */}
      <div className="p-3 border-t border-[#28342D] bg-[#080B0A]/60">
        <div className="px-3 py-2 bg-[#111815] border border-[#28342D] space-y-1">
          <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider flex items-center justify-between">
            <span>ENGINE:</span>
            <span className="text-[#A3B18A]">W3C WEB CRYPTO</span>
          </div>
          <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider flex items-center justify-between">
            <span>PRIMITIVES:</span>
            <span className="text-[#B7F397]">SHA / CSPRNG</span>
          </div>
          <div className="text-[10px] font-mono text-[#667653] uppercase tracking-wider flex items-center justify-between">
            <span>NETWORK:</span>
            <span className="text-[#8A968D]">ISOLATED (OFFLINE)</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Rail */}
      <aside className="hidden md:block w-60 shrink-0 bg-[#0D1210] border-r border-[#28342D] h-[calc(100vh-3.5rem)] overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/75 z-40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-[#0D1210] border-r border-[#28342D] z-50 transform transition-transform duration-200 ease-in-out md:hidden ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
