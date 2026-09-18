import React, { useState } from 'react';
import { 
  Settings, 
  ShieldAlert, 
  Megaphone, 
  Send, 
  KeyRound, 
  Server, 
  Check, 
  Copy, 
  RefreshCw, 
  Smartphone,
  Save,
  Radio,
  Sliders
} from 'lucide-react';
import { AppSettings } from '../types';
import { MASTER_CONFIG } from '../data/initialData';

interface AppSettingsViewProps {
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => Promise<void>;
  isSaving: boolean;
  onCopyApiKey: () => void;
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  settings,
  onSaveSettings,
  isSaving,
  onCopyApiKey,
  onTriggerToast,
}) => {
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
  const [maintenanceMessage, setMaintenanceMessage] = useState(settings.maintenanceMessage);
  const [announcementBanner, setAnnouncementBanner] = useState(settings.announcementBanner);
  const [showAnnouncement, setShowAnnouncement] = useState(settings.showAnnouncement);
  const [telegramChannelLink, setTelegramChannelLink] = useState(settings.telegramChannelLink);
  const [telegramChannelId, setTelegramChannelId] = useState(settings.telegramChannelId);
  const [backendUrl, setBackendUrl] = useState(settings.backendUrl || MASTER_CONFIG.BACKEND_URL);
  const [apiKey, setApiKey] = useState(settings.apiKey || MASTER_CONFIG.MASTER_API_KEY);
  const [edgeCacheTtlHours, setEdgeCacheTtlHours] = useState(settings.edgeCacheTtlHours || 24);
  const [autoTranscode, setAutoTranscode] = useState(settings.autoTranscode);

  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    onCopyApiKey();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      maintenanceMode,
      maintenanceMessage,
      announcementBanner,
      showAnnouncement,
      telegramChannelLink,
      telegramChannelId,
      backendUrl: backendUrl.trim(),
      apiKey: apiKey.trim(),
      edgeCacheTtlHours: Number(edgeCacheTtlHours),
      autoTranscode,
    };
    await onSaveSettings(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Action Bar */}
        <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#00E5FF]" />
              App Global Settings & Remote Configuration
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live updates are synced with Android client apps via <code className="text-[#00E5FF]">/api/admin</code>
            </p>
          </div>

          <button
            type="submit"
            id="save-settings-btn"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E50914] to-[#C10712] hover:from-[#f40d1a] hover:to-[#E50914] text-white text-xs font-bold shadow-lg shadow-[#E50914]/25 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing with Proxy...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Push Settings</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Cols: Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Maintenance Mode */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      App Maintenance Mode
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Emergency kill-switch to temporarily suspend user playback
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="toggle-maintenance-mode"
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={e => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#222234] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Custom Maintenance Message (Displayed to users)
                </label>
                <textarea
                  id="input-maintenance-message"
                  rows={3}
                  value={maintenanceMessage}
                  onChange={e => setMaintenanceMessage(e.target.value)}
                  placeholder="e.g. CINEFLIX is undergoing scheduled server updates..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  When enabled, Android apps block stream playback and display this announcement with a retry countdown.
                </p>
              </div>
            </div>

            {/* Section 2: Announcement Banner */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#00E5FF]/20 text-[#00E5FF]">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Global Announcement Banner
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Top marquee broadcast message pinned in the Android app header
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="toggle-show-announcement"
                    type="checkbox"
                    checked={showAnnouncement}
                    onChange={e => setShowAnnouncement(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#222234] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00E5FF]" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Announcement Banner Text
                </label>
                <input
                  id="input-announcement-banner"
                  type="text"
                  value={announcementBanner}
                  onChange={e => setAnnouncementBanner(e.target.value)}
                  placeholder="e.g. New 4K Movies Added This Weekend! Stream Salaar 2 Now in Dolby Atmos!"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-all"
                />
              </div>
            </div>

            {/* Section 3: Telegram Private Channel Link & ID */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Telegram Private Channel Storage Vault
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Channel where video files are uploaded and indexed by the streaming bot
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telegram Public/Private Channel Invite Link
                  </label>
                  <input
                    id="input-telegram-link"
                    type="url"
                    value={telegramChannelLink}
                    onChange={e => setTelegramChannelLink(e.target.value)}
                    placeholder="https://t.me/cineflix_official_channel"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Telegram Channel Username / Bot Target ID
                  </label>
                  <input
                    id="input-telegram-id"
                    type="text"
                    value={telegramChannelId}
                    onChange={e => setTelegramChannelId(e.target.value)}
                    placeholder="@cineflix_cloud_vault or -100192837465"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: System Architecture & Master API Key */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#E50914]/20 text-[#E50914]">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Master Admin API Credentials
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Pre-filled authentication credentials sent in <code className="text-[#00E5FF]">x-api-key</code> headers
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Backend Proxy Server URL
                  </label>
                  <input
                    id="input-backend-url"
                    type="url"
                    value={backendUrl}
                    onChange={e => setBackendUrl(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-mono text-white focus:outline-none focus:border-[#E50914] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label className="font-semibold text-slate-300">
                      Master Admin API Key (Configured)
                    </label>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey ? 'Copied Key!' : 'Copy Key'}</span>
                    </button>
                  </div>
                  <input
                    id="input-api-key"
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00E5FF] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Vercel Edge Cache TTL (Hours)
                    </label>
                    <input
                      id="input-cache-ttl"
                      type="number"
                      value={edgeCacheTtlHours}
                      onChange={e => setEdgeCacheTtlHours(parseInt(e.target.value, 10) || 24)}
                      className="w-full px-4 py-2 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#0F0F14] border border-[#222234]">
                    <div>
                      <span className="text-xs font-semibold text-white block">Auto Transcode to H.264</span>
                      <span className="text-[10px] text-slate-400">Fallback for legacy devices</span>
                    </div>
                    <input
                      id="checkbox-auto-transcode"
                      type="checkbox"
                      checked={autoTranscode}
                      onChange={e => setAutoTranscode(e.target.checked)}
                      className="w-4 h-4 accent-[#E50914] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Col: Live Device Preview (Android OTT Frame) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Android Client Live Mirror
                </span>
                <span className="text-[10px] font-mono text-slate-400">ExoPlayer v2.19</span>
              </div>

              {/* Simulated Phone Screen */}
              <div className="relative mx-auto w-full max-w-[280px] rounded-[36px] bg-[#0A0A0E] border-4 border-[#222234] shadow-2xl p-4 space-y-3 overflow-hidden text-center">
                {/* Phone Speaker Notch */}
                <div className="w-20 h-3 bg-[#222234] rounded-full mx-auto mb-2" />

                {/* App Header inside phone */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-extrabold text-white text-xs">
                    CINE<span className="text-[#E50914]">FLIX</span>
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold">● ONLINE</span>
                </div>

                {/* If Maintenance Mode is Active */}
                {maintenanceMode ? (
                  <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 my-6 space-y-2">
                    <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                    <h5 className="text-xs font-extrabold text-amber-300">Under Maintenance</h5>
                    <p className="text-[10px] text-amber-100/90 leading-relaxed">
                      {maintenanceMessage || 'CINEFLIX is currently upgrading servers.'}
                    </p>
                    <div className="text-[9px] font-mono text-amber-400 pt-1">
                      Retry in 00:14:59
                    </div>
                  </div>
                ) : (
                  /* Standard App Home state */
                  <div className="space-y-2.5 text-left">
                    {/* Announcement Banner inside mobile */}
                    {showAnnouncement && announcementBanner && (
                      <div className="p-2 rounded-lg bg-[#E50914]/20 border border-[#E50914]/50 text-[9px] text-white flex items-center gap-1.5 animate-pulse">
                        <Megaphone className="w-3 h-3 text-[#E50914] shrink-0" />
                        <span className="truncate">{announcementBanner}</span>
                      </div>
                    )}

                    {/* Featured Carousel Mock inside phone */}
                    <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-slate-800">
                      <img
                        src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80"
                        alt="Hero"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-2.5">
                        <span className="text-[9px] text-emerald-400 font-bold">98% Match • 4K UHD</span>
                        <h6 className="text-xs font-extrabold text-white">Salaar 2</h6>
                      </div>
                    </div>

                    <div className="text-[10px] font-bold text-slate-300">Trending Now on Telegram Proxy</div>
                    <div className="flex gap-2 overflow-hidden">
                      <div className="w-16 h-22 rounded-lg bg-slate-800 shrink-0 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=200&q=80"
                          alt="S5"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-16 h-22 rounded-lg bg-slate-800 shrink-0 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80"
                          alt="Dune"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="w-16 h-22 rounded-lg bg-slate-800 shrink-0 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80"
                          alt="Cyber"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Home Indicator line */}
                <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
