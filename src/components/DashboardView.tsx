import React from 'react';
import { 
  Film, 
  Tv, 
  Radio, 
  Zap, 
  Database, 
  Layers, 
  TrendingUp, 
  Server, 
  Play, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlusCircle,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  HardDrive
} from 'lucide-react';
import { ContentItem } from '../types';
import { NavTab } from './Sidebar';

interface DashboardOverviewProps {
  items: ContentItem[];
  proxyOnline: boolean;
  pingMs: number;
  onNavigate: (tab: NavTab) => void;
  onPlayItem: (item: ContentItem) => void;
  maintenanceMode: boolean;
  announcementBanner: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  items,
  proxyOnline,
  pingMs,
  onNavigate,
  onPlayItem,
  maintenanceMode,
  announcementBanner,
}) => {
  const moviesCount = items.filter(i => i.category === 'Movie').length;
  const seriesCount = items.filter(i => i.category === 'Web Series').length;
  const liveTvCount = items.filter(i => i.category === 'Live TV').length;
  const totalViews = items.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0);

  // Stats calculation
  const totalStorageGB = (moviesCount * 14.2 + seriesCount * 42.5 + liveTvCount * 2.1).toFixed(1);
  const cacheHitRate = 96.4;
  const activeStreams = proxyOnline ? 342 : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Maintenance Mode Alert Banner if active */}
      {maintenanceMode && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-300">Application Maintenance Mode is ACTIVE</h4>
              <p className="text-xs text-amber-200/80">Android and Web end-users will receive maintenance splash screen upon launch.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors"
          >
            Configure
          </button>
        </div>
      )}

      {/* Announcement Preview Bar */}
      {announcementBanner && (
        <div className="px-4 py-2.5 rounded-xl bg-[#181824] border border-[#222234] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 truncate">
            <span className="px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] font-bold text-[10px] tracking-wide uppercase">
              Global Announcement
            </span>
            <span className="truncate font-medium">{announcementBanner}</span>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-slate-400 hover:text-white shrink-0 ml-3 text-[11px] underline"
          >
            Edit
          </button>
        </div>
      )}

      {/* Top 4 Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Movies & Series */}
        <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] hover:border-[#E50914]/40 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E50914]/5 rounded-full blur-2xl group-hover:bg-[#E50914]/15 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Ingested Content
            </span>
            <div className="p-2 rounded-xl bg-[#E50914]/15 text-[#E50914]">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {items.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Titles</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222234] flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E50914]" />
              {moviesCount} Movies
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
              {seriesCount} Series
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {liveTvCount} Live
            </span>
          </div>
        </div>

        {/* Card 2: Telegram Stream Status */}
        <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] hover:border-emerald-500/40 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Telegram Stream Status
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Radio className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="relative flex h-3.5 w-3.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  proxyOnline ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3.5 w-3.5 ${
                  proxyOnline ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              {proxyOnline ? 'Active & Healthy' : 'Local Sync Active'}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222234] flex items-center justify-between text-xs text-slate-400">
            <span>Ping: <strong className="text-slate-200">{pingMs}ms</strong></span>
            <span className="text-emerald-400 font-semibold">{activeStreams} concurrent users</span>
          </div>
        </div>

        {/* Card 3: Storage Used */}
        <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] hover:border-[#00E5FF]/40 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/5 rounded-full blur-2xl group-hover:bg-[#00E5FF]/15 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cloud Storage Used
            </span>
            <div className="p-2 rounded-xl bg-[#00E5FF]/15 text-[#00E5FF]">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalStorageGB}
            </span>
            <span className="text-xs text-slate-400 font-medium">GB (Telegram Vault)</span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222234]">
            <div className="w-full h-1.5 rounded-full bg-[#0F0F14] overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#00E5FF] to-[#0099FF] w-[34%]" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>Zero host bandwidth costs</span>
              <span className="text-[#00E5FF] font-semibold">Unlimited Tier</span>
            </div>
          </div>
        </div>

        {/* Card 4: Vercel Edge Cache Hit Rate */}
        <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] hover:border-purple-500/40 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/15 transition-all" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Edge Cache Hit Rate
            </span>
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {cacheHitRate}%
            </span>
            <span className="text-xs text-emerald-400 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +2.4%
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-[#222234] flex items-center justify-between text-xs text-slate-400">
            <span>HTTP 206 Fast Scrub</span>
            <span className="text-slate-200 font-semibold">0.12s seek delay</span>
          </div>
        </div>
      </div>

      {/* Architecture & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Streaming Infrastructure Status */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-5">
          <div className="flex items-center justify-between border-b border-[#222234] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#181824] border border-[#222234] text-[#00E5FF]">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  OTT Storage & Edge Relay Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  Dual-tier Telegram Private Vault + Vercel Serverless Range Relay
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('stream_tester')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-semibold hover:bg-[#00E5FF]/20 transition-all"
            >
              <span>Test Stream Link</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#222234] space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                1. Storage Engine
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                Telegram MTProto
              </div>
              <p className="text-xs text-slate-400">
                Encrypted cloud chunks stored in private channel vault. Zero storage cost.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#222234] space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                2. Vercel Serverless
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Edge Range Proxy
              </div>
              <p className="text-xs text-slate-400">
                Transforms Telegram file IDs into standard HTTP 206 chunked MP4 video streams.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0F0F14] border border-[#222234] space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                3. Client Delivery
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E50914]" />
                Android & Web App
              </div>
              <p className="text-xs text-slate-400">
                ExoPlayer & HTML5 video players stream smoothly with instant forward/rewind scrubbing.
              </p>
            </div>
          </div>

          {/* Real-time Streaming Metrics Bar */}
          <div className="p-4 rounded-xl bg-[#181824] border border-[#222234] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Proxy Target:</span>
              <code className="text-[#00E5FF] font-mono">https://cineflix-proxy.vercel.app</code>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Avg Chunk Delivery: <strong className="text-white">41ms</strong></span>
              <span>Bitrate Capacity: <strong className="text-white">100+ Gbps</strong></span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Control Shortcuts */}
        <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Rapid Admin Operations
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Common tasks and stream ingestion shortcuts
            </p>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={() => onNavigate('add')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#E50914]/20 to-[#E50914]/10 border border-[#E50914]/40 hover:border-[#E50914] text-white text-xs font-bold transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#E50914] text-white">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Publish New Title</div>
                    <div className="text-[10px] font-normal text-slate-300">Push movie metadata to Android API</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#E50914] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('stream_tester')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#181824] hover:bg-[#222234] border border-[#222234] hover:border-[#00E5FF]/50 text-white text-xs font-bold transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Probe Telegram Stream</div>
                    <div className="text-[10px] font-normal text-slate-400">Test Range 206 scrubbing & bitrates</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#00E5FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('settings')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#181824] hover:bg-[#222234] border border-[#222234] hover:border-slate-500 text-white text-xs font-bold transition-all text-left group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-700/40 text-slate-300">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold">Maintenance & Banner</div>
                    <div className="text-[10px] font-normal text-slate-400">Control user access & alerts</div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0F0F14] border border-[#222234] text-[11px] text-slate-400">
            <span className="text-slate-300 font-semibold">Total Audience Reach: </span>
            <strong className="text-white font-mono">{totalViews.toLocaleString()}</strong> stream sessions logged.
          </div>
        </div>
      </div>

      {/* Recent Content Showcase Table */}
      <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Recently Ingested Media
            </h3>
            <p className="text-xs text-slate-400">
              Latest movies and web series synced with the OTT platform
            </p>
          </div>
          <button
            onClick={() => onNavigate('library')}
            className="text-xs font-semibold text-[#00E5FF] hover:underline"
          >
            View Full Library ({items.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222234] text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Poster & Title</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Genre</th>
                <th className="pb-3">IMDb Rating</th>
                <th className="pb-3">Badges</th>
                <th className="pb-3">Telegram File ID</th>
                <th className="pb-3 pr-2 text-right">Playback Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222234]">
              {items.slice(0, 5).map(item => (
                <tr key={item.id} className="hover:bg-[#181824]/60 transition-colors group">
                  <td className="py-3.5 pl-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-14 object-cover rounded-lg border border-[#222234] shrink-0"
                      />
                      <div className="min-w-0 max-w-xs">
                        <div className="font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{item.tagline}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.category === 'Movie'
                          ? 'bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30'
                          : item.category === 'Web Series'
                          ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3.5 text-slate-300 font-medium">
                    {item.genre}
                  </td>

                  <td className="py-3.5">
                    <span className="font-bold text-amber-400">★ {item.imdbRating}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({item.matchScore}%)</span>
                  </td>

                  <td className="py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {item.qualityBadges.slice(0, 2).map(b => (
                        <span key={b} className="px-1.5 py-0.5 rounded bg-[#0F0F14] border border-[#222234] text-[9px] font-semibold text-slate-300">
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 font-mono text-[11px] text-slate-400">
                    <span className="truncate max-w-[120px] inline-block">
                      {item.telegramFileId.substring(0, 14)}...
                    </span>
                  </td>

                  <td className="py-3.5 pr-2 text-right">
                    <button
                      onClick={() => onPlayItem(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E50914]/15 hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#E50914]/40 font-bold transition-all shadow-sm hover:shadow-md hover:shadow-[#E50914]/30"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test Stream</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
