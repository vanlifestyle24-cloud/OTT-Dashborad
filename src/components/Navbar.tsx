import React from 'react';
import { 
  Search, 
  PlusCircle, 
  Activity, 
  KeyRound, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  Zap,
  CheckCircle2,
  Tv
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { MASTER_CONFIG } from '../data/initialData';

interface NavbarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
  proxyOnline: boolean;
  pingMs: number;
  isPinging: boolean;
  onPingProxy: () => void;
  onCopyApiKey: () => void;
  maintenanceMode: boolean;
  totalContent: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  proxyOnline,
  pingMs,
  isPinging,
  onPingProxy,
  onCopyApiKey,
  maintenanceMode,
  totalContent,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard Overview', desc: 'Real-time OTT streaming analytics and Vercel edge proxy telemetry' };
      case 'add':
        return { title: 'Add New Content', desc: 'Ingest movies, web series, and link Telegram private channel file streams' };
      case 'library':
        return { title: 'Content Library', desc: `Managing ${totalContent} published OTT media titles & direct streams` };
      case 'stream_tester':
        return { title: 'Telegram Stream Tester', desc: 'Probe HTTP 206 Partial Content range seeking and video scrubber fidelity' };
      case 'settings':
        return { title: 'Global App Settings', desc: 'Configure maintenance mode, announcement banner, and streaming channels' };
    }
  };

  const { title, desc } = getTabTitle();

  return (
    <header className="sticky top-0 z-20 h-18 bg-[#0F0F14]/90 backdrop-blur-md border-b border-[#222234] px-6 flex items-center justify-between gap-4">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-extrabold text-white tracking-tight truncate">
            {title}
          </h1>
          {maintenanceMode && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              MAINTENANCE ON
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate hidden sm:block">
          {desc}
        </p>
      </div>

      {/* Right Controls & Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Ping / Proxy Status Button */}
        <button
          id="ping-proxy-btn"
          onClick={onPingProxy}
          disabled={isPinging}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
            proxyOnline
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/50'
              : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
          }`}
          title="Click to ping Vercel Edge Streaming Proxy"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[#00E5FF]' : ''}`} />
          <span className="hidden md:inline">
            {isPinging ? 'Pinging...' : proxyOnline ? `Edge Active (${pingMs}ms)` : 'Offline (Local Sync)'}
          </span>
          <span className="md:hidden">
            {proxyOnline ? `${pingMs}ms` : 'Sync'}
          </span>
        </button>

        {/* Master API Key Quick Pill */}
        <button
          id="navbar-key-pill"
          onClick={onCopyApiKey}
          className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-mono text-slate-300 hover:text-[#00E5FF] transition-all"
          title="Master API Key - Click to copy"
        >
          <KeyRound className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="truncate max-w-[130px]">cineflix_live...974ef</span>
        </button>

        {/* Quick Stream Tester shortcut */}
        <button
          id="navbar-stream-tester-btn"
          onClick={() => onNavigate('stream_tester')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181824] hover:bg-[#222234] border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/10 transition-all"
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Stream Tester</span>
        </button>

        {/* Primary Action Button: Add Movie */}
        {currentTab !== 'add' && (
          <button
            id="navbar-add-content-btn"
            onClick={() => onNavigate('add')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#C10712] hover:from-[#f40d1a] hover:to-[#E50914] text-white text-xs font-bold shadow-md shadow-[#E50914]/25 hover:shadow-lg hover:shadow-[#E50914]/40 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Content</span>
          </button>
        )}
      </div>
    </header>
  );
};
