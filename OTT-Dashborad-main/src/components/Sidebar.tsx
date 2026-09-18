import React from 'react';
import { 
  LayoutDashboard, 
  Film, 
  Tv, 
  Zap, 
  Settings, 
  Radio, 
  ShieldCheck, 
  Copy, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Server
} from 'lucide-react';
import { MASTER_CONFIG } from '../data/initialData';

export type NavTab = 'dashboard' | 'add' | 'library' | 'stream_tester' | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  proxyOnline: boolean;
  itemsCount: number;
  onCopyApiKey: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  proxyOnline,
  itemsCount,
  onCopyApiKey,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Metrics, storage & live cache',
    },
    {
      id: 'add' as NavTab,
      label: 'Add Movie / Series',
      icon: Film,
      badge: 'New',
      badgeColor: 'bg-[#E50914] text-white',
      desc: 'Publish with Telegram stream',
    },
    {
      id: 'library' as NavTab,
      label: 'Content Library',
      icon: Tv,
      badge: itemsCount.toString(),
      badgeColor: 'bg-[#222234] text-slate-300',
      desc: 'Browse, edit & delete titles',
    },
    {
      id: 'stream_tester' as NavTab,
      label: 'Telegram Stream Tester',
      icon: Zap,
      badge: 'HTTP 206',
      badgeColor: 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40',
      desc: 'Probe edge partial scrubber',
    },
    {
      id: 'settings' as NavTab,
      label: 'App Global Settings',
      icon: Settings,
      badge: null,
      desc: 'Maintenance, banner & API keys',
    },
  ];

  return (
    <aside
      id="admin-sidebar"
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col bg-[#0F0F14] border-r border-[#222234] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 px-5 flex items-center justify-between border-b border-[#222234] bg-[#14141E]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] to-[#80050B] shadow-lg shadow-[#E50914]/30 shrink-0">
            <Film className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-wider text-white">
                  CINE<span className="text-[#E50914]">FLIX</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30">
                  OTT
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 tracking-tight truncate">
                Admin Control Room
              </span>
            </div>
          )}
        </div>

        <button
          id="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#222234] transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1.5">
        <div className={`px-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase ${isCollapsed ? 'hidden' : 'block'}`}>
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#E50914]/15 via-[#181824] to-[#181824] text-white border border-[#E50914]/40 shadow-sm shadow-[#E50914]/10'
                  : 'text-slate-300 hover:text-white hover:bg-[#181824]/80 border border-transparent'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r bg-[#E50914] shadow-[0_0_8px_#E50914]" />
              )}
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                    : 'bg-[#181824] text-slate-400 group-hover:text-[#00E5FF] group-hover:bg-[#222234]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <div className="truncate">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Server & Proxy Diagnostics Pill */}
      {!isCollapsed ? (
        <div className="p-4 m-3 rounded-2xl bg-[#14141E] border border-[#222234] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    proxyOnline ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                    proxyOnline ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <span className="text-xs font-bold text-slate-200">
                {proxyOnline ? 'Edge Proxy Live' : 'Local Mock Cache'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">HTTP 206</span>
          </div>

          <div className="text-[11px] font-mono text-slate-400 truncate bg-[#0F0F14] p-2 rounded-lg border border-[#222234]">
            <div className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Stream Proxy</div>
            <div className="text-slate-300 truncate">cineflix-proxy.vercel.app</div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              id="copy-api-key-btn"
              onClick={onCopyApiKey}
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-[#00E5FF] transition-colors"
              title="Copy Master API Key"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy API Key</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">v3.4.2</span>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-[#222234]">
          <div
            className={`w-3 h-3 rounded-full ${proxyOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}
            title={proxyOnline ? 'Proxy Live' : 'Local Sync Active'}
          />
        </div>
      )}
    </aside>
  );
};
