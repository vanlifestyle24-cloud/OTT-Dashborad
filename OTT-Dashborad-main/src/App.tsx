import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DashboardOverview } from './components/DashboardView';
import { AddContentForm } from './components/AddContentForm';
import { ContentLibrary } from './components/ContentLibrary';
import { StreamTester } from './components/StreamTester';
import { AppSettingsView } from './components/AppSettingsView';

import { ContentItem, AppSettings, ToastMessage } from './types';
import { 
  loadLocalContent, 
  loadLocalSettings, 
  pingBackendProxy, 
  syncContentFromProxy, 
  publishContentToProxy, 
  deleteContentFromProxy, 
  updateAppSettingsOnProxy 
} from './services/api';

export default function App() {
  // Navigation & Layout State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Data Store State
  const [items, setItems] = useState<ContentItem[]>(() => loadLocalContent());
  const [settings, setSettings] = useState<AppSettings>(() => loadLocalSettings());

  // Editing & Playback State
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [playingItem, setPlayingItem] = useState<ContentItem | null>(null);

  // Network & Telemetry State
  const [proxyOnline, setProxyOnline] = useState<boolean>(true);
  const [pingMs, setPingMs] = useState<number>(38);
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Toast Notification Stack
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration = 4500) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts(prev => [...prev, { id, type, title, message, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Ping Backend Proxy
  const checkProxyStatus = useCallback(async () => {
    setIsPinging(true);
    try {
      const result = await pingBackendProxy(settings.backendUrl, settings.apiKey);
      setProxyOnline(result.online);
      setPingMs(result.latencyMs);
    } catch (err) {
      setProxyOnline(false);
    } finally {
      setIsPinging(false);
    }
  }, [settings.backendUrl, settings.apiKey]);

  // Initial Boot: Check proxy & attempt sync
  useEffect(() => {
    checkProxyStatus();
    syncContentFromProxy(settings.backendUrl, settings.apiKey).then(res => {
      if (res.data && res.data.length > 0) {
        setItems(res.data);
      }
    });
  }, [checkProxyStatus, settings.backendUrl, settings.apiKey]);

  // Copy API Key helper
  const handleCopyApiKey = useCallback(() => {
    navigator.clipboard.writeText(settings.apiKey);
    addToast('success', 'Master API Key Copied', 'cineflix_live_master_98f4a21e7d0b3c65e8a11974ef');
  }, [settings.apiKey, addToast]);

  // Copy URL helper
  const handleCopyUrl = useCallback(
    (url: string) => {
      navigator.clipboard.writeText(url);
      addToast('info', 'Stream Link Copied', url);
    },
    [addToast]
  );

  // Publish / Ingest Media Item
  const handlePublish = async (content: ContentItem) => {
    setIsPublishing(true);
    try {
      const res = await publishContentToProxy(content, settings.backendUrl, settings.apiKey);
      if (res.success && res.data) {
        // Update local state
        setItems(prev => {
          const idx = prev.findIndex(i => i.id === res.data!.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = res.data!;
            return next;
          }
          return [res.data!, ...prev];
        });

        if (res.source === 'live-proxy') {
          addToast(
            'success',
            'Published to Android App',
            `"${content.title}" is now broadcasting via Vercel Edge stream relay!`
          );
        } else {
          addToast(
            'warning',
            'Saved to Local Sync Store',
            `"${content.title}" saved locally. Proxy reported: ${res.error || 'Offline relay mode active'}`
          );
        }

        setEditingItem(null);
        setCurrentTab('library');
      } else {
        addToast('error', 'Publish Failed', res.error || 'Could not broadcast title');
      }
    } catch (err: any) {
      addToast('error', 'Network Error', err.message || 'Connection interrupted');
    } finally {
      setIsPublishing(false);
    }
  };

  // Delete Media Item
  const handleDeleteItem = async (id: string, title: string) => {
    try {
      const res = await deleteContentFromProxy(id, settings.backendUrl, settings.apiKey);
      if (res.success) {
        setItems(prev => prev.filter(i => i.id !== id));
        addToast(
          'info',
          'Content Removed',
          `"${title}" has been deleted from the catalog and Android feed.`
        );
      } else {
        addToast('error', 'Delete Failed', res.error || 'Could not delete title');
      }
    } catch (err: any) {
      addToast('error', 'Error', err.message || 'Failed to remove content');
    }
  };

  // Edit Action Trigger
  const handleEditItem = (item: ContentItem) => {
    setEditingItem(item);
    setCurrentTab('add');
    addToast('info', 'Editing Mode', `Populated "${item.title}" into the ingestion form.`);
  };

  // Save Global Settings
  const handleSaveSettings = async (newSettings: AppSettings) => {
    setIsSavingSettings(true);
    try {
      const res = await updateAppSettingsOnProxy(newSettings, newSettings.backendUrl, newSettings.apiKey);
      setSettings(newSettings);
      if (res.source === 'live-proxy') {
        addToast('success', 'Settings Synchronized', 'Global configuration successfully pushed to Vercel Proxy!');
      } else {
        addToast('info', 'Settings Saved Locally', 'Updated configuration stored in browser cache.');
      }
    } catch (err: any) {
      addToast('error', 'Sync Failed', err.message || 'Could not push settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F14] text-slate-100 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tab => {
          if (tab !== 'add' && editingItem) {
            setEditingItem(null);
          }
          setCurrentTab(tab);
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        proxyOnline={proxyOnline}
        itemsCount={items.length}
        onCopyApiKey={handleCopyApiKey}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-72'
        }`}
      >
        {/* Top Sticky Navbar */}
        <Navbar
          currentTab={currentTab}
          onNavigate={tab => {
            if (tab !== 'add' && editingItem) {
              setEditingItem(null);
            }
            setCurrentTab(tab);
          }}
          proxyOnline={proxyOnline}
          pingMs={pingMs}
          isPinging={isPinging}
          onPingProxy={checkProxyStatus}
          onCopyApiKey={handleCopyApiKey}
          maintenanceMode={settings.maintenanceMode}
          totalContent={items.length}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto pb-16">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              items={items}
              proxyOnline={proxyOnline}
              pingMs={pingMs}
              onNavigate={setCurrentTab}
              onPlayItem={item => setPlayingItem(item)}
              maintenanceMode={settings.maintenanceMode}
              announcementBanner={settings.showAnnouncement ? settings.announcementBanner : ''}
            />
          )}

          {currentTab === 'add' && (
            <AddContentForm
              onPublish={handlePublish}
              isPublishing={isPublishing}
              editingItem={editingItem}
              onCancelEdit={() => {
                setEditingItem(null);
                setCurrentTab('library');
              }}
              onTriggerToast={addToast}
            />
          )}

          {currentTab === 'library' && (
            <ContentLibrary
              items={items}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onPlayItem={item => setPlayingItem(item)}
              onCopyUrl={handleCopyUrl}
              onNavigateAdd={() => {
                setEditingItem(null);
                setCurrentTab('add');
              }}
            />
          )}

          {currentTab === 'stream_tester' && (
            <StreamTester
              onCopyUrl={handleCopyUrl}
              onTriggerToast={addToast}
            />
          )}

          {currentTab === 'settings' && (
            <AppSettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              isSaving={isSavingSettings}
              onCopyApiKey={handleCopyApiKey}
              onTriggerToast={addToast}
            />
          )}
        </main>
      </div>

      {/* Global Video Player Modal */}
      {playingItem && (
        <VideoPlayerModal
          item={playingItem}
          onClose={() => setPlayingItem(null)}
          onCopyStreamUrl={handleCopyUrl}
        />
      )}

      {/* Smooth Toast Alerts Stack */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
