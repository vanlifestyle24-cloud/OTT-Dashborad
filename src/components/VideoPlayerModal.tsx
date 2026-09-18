import React, { useState, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Copy, 
  ExternalLink, 
  Radio, 
  Check, 
  Sparkles,
  Info,
  Tv,
  Film
} from 'lucide-react';
import { ContentItem } from '../types';
import { SAMPLE_WORKING_STREAM } from '../data/initialData';

interface VideoPlayerModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onCopyStreamUrl: (url: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  onClose,
  onCopyStreamUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [useFallbackStream, setUseFallbackStream] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!item) return null;

  const activeStreamSource = useFallbackStream
    ? SAMPLE_WORKING_STREAM
    : (item.streamUrl || SAMPLE_WORKING_STREAM);

  const handleCopy = () => {
    onCopyStreamUrl(item.streamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="video-player-modal"
        className="relative w-full max-w-4xl bg-[#14141E] border border-[#222234] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222234] bg-[#181824]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914]">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#E50914] text-white">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400">({item.releaseYear})</span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-md">{item.tagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#222234] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative bg-black aspect-video w-full flex items-center justify-center overflow-hidden group">
          <video
            ref={videoRef}
            src={activeStreamSource}
            controls
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setHasError(true)}
            onLoadedData={() => setHasError(false)}
            poster={item.backdropUrl || item.posterUrl}
            className="w-full h-full object-contain"
          />

          {hasError && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E50914]/20 border border-[#E50914] flex items-center justify-center text-[#E50914]">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Telegram Edge Stream Proxy Notice</p>
                <p className="text-xs text-slate-400 max-w-md mt-1">
                  The Vercel proxy for this specific Telegram File ID returned a cold-start or CORS constraint in the browser iframe.
                </p>
              </div>
              <button
                onClick={() => {
                  setUseFallbackStream(true);
                  setHasError(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#00E5FF] text-black text-xs font-bold shadow-lg shadow-[#00E5FF]/30 hover:bg-[#33ebff] transition-all cursor-pointer"
              >
                Switch to High-Bitrate Direct Demo Stream
              </button>
            </div>
          )}

          {/* Quality badge overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 pointer-events-none">
            {item.qualityBadges.map(b => (
              <span
                key={b}
                className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white tracking-wider uppercase"
              >
                {b}
              </span>
            ))}
          </div>

          <div className="absolute top-4 right-4 pointer-events-none">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-[11px] font-semibold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Edge Relay
            </span>
          </div>
        </div>

        {/* Video Technical Information & Stream Links */}
        <div className="p-5 space-y-4 bg-[#14141E] border-t border-[#222234] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-[#0F0F14] border border-[#222234]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">IMDb & Match</span>
              <div className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                <span className="text-amber-400">★ {item.imdbRating}</span>
                <span className="text-emerald-400">({item.matchScore}% Match)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0F0F14] border border-[#222234]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">HTTP Protocol</span>
              <div className="text-sm font-bold text-[#00E5FF] mt-0.5 flex items-center gap-1.5">
                <span>HTTP 206 (Partial Stream)</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#0F0F14] border border-[#222234]">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Duration</span>
              <div className="text-sm font-bold text-white mt-0.5">{item.duration}</div>
            </div>
          </div>

          {/* Generated Stream URL & Telegram File ID */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Vercel Proxy Stream URL:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[#00E5FF] hover:underline font-mono text-xs cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Stream Link'}
              </button>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] font-mono text-xs text-slate-300 break-all select-all">
              {item.streamUrl}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-[#222234]">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-[11px] text-slate-400">Telegram File ID:</span>
              <span className="font-mono text-slate-300 truncate max-w-[200px] sm:max-w-xs">{item.telegramFileId}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setUseFallbackStream(!useFallbackStream)}
                className="px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                {useFallbackStream ? 'Use Telegram Stream URL' : 'Use Direct 4K Demo Stream'}
              </button>
              <a
                href={item.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E50914]/20 hover:bg-[#E50914]/30 border border-[#E50914]/40 text-xs font-semibold text-[#E50914] transition-colors"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
