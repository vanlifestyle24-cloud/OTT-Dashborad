import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Play, 
  Send, 
  Image as ImageIcon, 
  Radio, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Layers,
  Star,
  Clock,
  Calendar,
  Tag,
  AlertCircle,
  Copy
} from 'lucide-react';
import { ContentItem, CategoryType, GenreType, QualityBadge } from '../types';
import { MASTER_CONFIG, SAMPLE_WORKING_STREAM } from '../data/initialData';
import { fetchMovieFromOmdb } from '../services/omdbService';

interface AddContentFormProps {
  onPublish: (content: ContentItem) => Promise<void>;
  isPublishing: boolean;
  editingItem?: ContentItem | null;
  onCancelEdit?: () => void;
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

const ALL_CATEGORIES: CategoryType[] = ['Movie', 'Web Series', 'Live TV'];
const ALL_GENRES: GenreType[] = [
  'Action',
  'Sci-Fi',
  'Thriller',
  'Comedy',
  'Romance',
  'Horror',
  'Adventure',
  'Drama',
  'Fantasy',
  'Anime',
];
const ALL_QUALITY_BADGES: QualityBadge[] = [
  '4K UHD',
  'HDR10+',
  'Dolby Atmos',
  '5.1',
  'FHD 1080p',
];

export const AddContentForm: React.FC<AddContentFormProps> = ({
  onPublish,
  isPublishing,
  editingItem,
  onCancelEdit,
  onTriggerToast,
}) => {
  // Form State
  const [title, setTitle] = useState(editingItem?.title || '');
  const [tagline, setTagline] = useState(editingItem?.tagline || '');
  const [category, setCategory] = useState<CategoryType>(editingItem?.category || 'Movie');
  const [genre, setGenre] = useState<GenreType>(editingItem?.genre || 'Action');
  const [releaseYear, setReleaseYear] = useState<number>(editingItem?.releaseYear || 2026);
  const [duration, setDuration] = useState(editingItem?.duration || '2h 15m');
  const [imdbRating, setImdbRating] = useState<number>(editingItem?.imdbRating || 8.7);
  const [matchScore, setMatchScore] = useState<number>(editingItem?.matchScore || 96);
  const [posterUrl, setPosterUrl] = useState(editingItem?.posterUrl || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80');
  const [backdropUrl, setBackdropUrl] = useState(editingItem?.backdropUrl || 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80');
  const [qualityBadges, setQualityBadges] = useState<QualityBadge[]>(
    editingItem?.qualityBadges || ['4K UHD', 'Dolby Atmos', '5.1']
  );
  const [telegramFileId, setTelegramFileId] = useState(
    editingItem?.telegramFileId || 'BAACAgUAAxkBAAICwGV2r9Q8y9K0xZm2aP6QxZ1k8n5vAAITBwACv7eYV1xL_zKk71W0NAQ'
  );

  // Stream preview state
  const [streamUrl, setStreamUrl] = useState(
    editingItem?.streamUrl ||
      `${MASTER_CONFIG.BACKEND_URL}/api/stream?fileId=BAACAgUAAxkBAAICwGV2r9Q8y9K0xZm2aP6QxZ1k8n5vAAITBwACv7eYV1xL_zKk71W0NAQ`
  );
  const [activePlayerSource, setActivePlayerSource] = useState<string>('');
  const [playerTested, setPlayerTested] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const [useDemoDirectStream, setUseDemoDirectStream] = useState(false);

  // Form Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toggle Quality Badge
  const toggleBadge = (badge: QualityBadge) => {
    if (qualityBadges.includes(badge)) {
      if (qualityBadges.length === 1) {
        onTriggerToast('warning', 'Badge Required', 'Select at least one quality badge');
        return;
      }
      setQualityBadges(qualityBadges.filter(b => b !== badge));
    } else {
      setQualityBadges([...qualityBadges, badge]);
    }
  };

  // Generate Stream URL from Telegram File ID
  const handleGenerateStream = () => {
    if (!telegramFileId.trim()) {
      setErrors(prev => ({ ...prev, telegramFileId: 'Telegram File ID is required' }));
      onTriggerToast('error', 'Missing File ID', 'Please enter a valid Telegram File ID');
      return;
    }
    setErrors(prev => ({ ...prev, telegramFileId: '' }));
    const generated = `${MASTER_CONFIG.BACKEND_URL}/api/stream?fileId=${encodeURIComponent(telegramFileId.trim())}`;
    setStreamUrl(generated);
    setActivePlayerSource(useDemoDirectStream ? SAMPLE_WORKING_STREAM : generated);
    setPlayerTested(true);
    setStreamError(false);
    onTriggerToast('info', 'Stream Link Generated', generated);
  };

  // Quick Preset / Autofill Samples
  const loadPreset = (presetName: 'salaar' | 'stranger' | 'avatar') => {
    if (presetName === 'salaar') {
      setTitle('Salaar 2: Shouryaanga Parvam');
      setTagline('The battle for Khansaar enters its most ruthless and brutal final chapter.');
      setCategory('Movie');
      setGenre('Action');
      setReleaseYear(2026);
      setDuration('2h 45m');
      setImdbRating(8.5);
      setMatchScore(98);
      setPosterUrl('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80');
      setQualityBadges(['4K UHD', 'Dolby Atmos', '5.1']);
      const fid = 'BAACAgUAAxkBAAICwGV2r9Q8y9K0xZm2aP6QxZ1k8n5vAAITBwACv7eYV1xL_zKk71W0NAQ';
      setTelegramFileId(fid);
      setStreamUrl(`${MASTER_CONFIG.BACKEND_URL}/api/stream?fileId=${fid}`);
    } else if (presetName === 'stranger') {
      setTitle('Stranger Things S5');
      setTagline('The Upside Down bleeds into Hawkins. The final showdown for humanity begins.');
      setCategory('Web Series');
      setGenre('Sci-Fi');
      setReleaseYear(2026);
      setDuration('8 Episodes');
      setImdbRating(8.9);
      setMatchScore(99);
      setPosterUrl('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80');
      setQualityBadges(['4K UHD', 'HDR10+', 'Dolby Atmos']);
      const fid = 'BAACAgUAAxkBAAICz2V3t5K1lM0a9X7Y2Z4QwErT90UvAAIOBgACm7nZV8aM_wJj90Y2NAQ';
      setTelegramFileId(fid);
      setStreamUrl(`${MASTER_CONFIG.BACKEND_URL}/api/stream?fileId=${fid}`);
    } else {
      setTitle('Avatar 3: Fire and Ash');
      setTagline('Into the volcanic deserts of Pandora, discovering the volatile Ash People.');
      setCategory('Movie');
      setGenre('Sci-Fi');
      setReleaseYear(2026);
      setDuration('3h 10m');
      setImdbRating(9.0);
      setMatchScore(97);
      setPosterUrl('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80');
      setBackdropUrl('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80');
      setQualityBadges(['4K UHD', 'HDR10+', 'Dolby Atmos', '5.1']);
      const fid = 'BAACAgUAAxkBAAIDBmV4s3P8y6H2q1Z9xK0pW8mN5vT2AAIPBgACo8pZV3mK_rTt11V3NAQ';
      setTelegramFileId(fid);
      setStreamUrl(`${MASTER_CONFIG.BACKEND_URL}/api/stream?fileId=${fid}`);
    }
    onTriggerToast('info', 'Autofilled Template', `Populated ${presetName.toUpperCase()} sample metadata`);
  };

  const [isOmdbLoading, setIsOmdbLoading] = useState(false);
  const [omdbSource, setOmdbSource] = useState<'localStorage' | 'supabase-cloud' | 'omdb-live' | null>(null);

  const handleOmdbSearch = async () => {
    if (!title.trim()) {
      onTriggerToast('warning', 'Enter Title', 'Please enter a movie title first to search OMDb');
      return;
    }
    setIsOmdbLoading(true);
    setOmdbSource(null);
    try {
      const response = await fetchMovieFromOmdb(title);
      if (response && response.result) {
        const { result, source } = response;
        setOmdbSource(source);
        setTitle(result.title);
        setTagline(result.tagline);
        setReleaseYear(result.releaseYear);
        setDuration(result.duration);
        setImdbRating(result.imdbRating);
        setMatchScore(result.matchScore);
        if (result.posterUrl) {
          setPosterUrl(result.posterUrl);
          setBackdropUrl(result.backdropUrl || result.posterUrl);
        }
        if (result.genre) {
          setGenre(result.genre as any);
        }
        const sourceLabel = source === 'supabase-cloud' ? 'Supabase Cloud Cache' : source === 'localStorage' ? 'Local Storage Cache' : 'OMDb Live API';
        onTriggerToast('success', 'OMDb Metadata Fetched', `Successfully loaded "${result.title}" via ${sourceLabel}!`);
      }
    } catch (err: any) {
      onTriggerToast('error', 'OMDb Error', err.message || 'Could not fetch from OMDb');
    } finally {
      setIsOmdbLoading(false);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!tagline.trim()) newErrors.tagline = 'Tagline is required';
    if (!duration.trim()) newErrors.duration = 'Duration is required';
    if (!telegramFileId.trim()) newErrors.telegramFileId = 'Telegram File ID is required';
    if (!posterUrl.trim()) newErrors.posterUrl = 'Poster image URL is required';
    if (!backdropUrl.trim()) newErrors.backdropUrl = 'Backdrop image URL is required';
    if (releaseYear < 1900 || releaseYear > 2035) newErrors.releaseYear = 'Enter a valid year';
    if (imdbRating < 0 || imdbRating > 10) newErrors.imdbRating = 'Rating must be 0 - 10';
    if (matchScore < 0 || matchScore > 100) newErrors.matchScore = 'Match % must be 0 - 100';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler -> Sends POST to /api/admin
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      onTriggerToast('error', 'Validation Error', 'Please correct the highlighted fields in the form.');
      return;
    }

    const payload: ContentItem = {
      id: editingItem?.id || `cf-${Date.now().toString().slice(-6)}`,
      title: title.trim(),
      tagline: tagline.trim(),
      category,
      genre,
      releaseYear: Number(releaseYear),
      duration: duration.trim(),
      imdbRating: Number(imdbRating),
      matchScore: Number(matchScore),
      posterUrl: posterUrl.trim(),
      backdropUrl: backdropUrl.trim(),
      qualityBadges,
      telegramFileId: telegramFileId.trim(),
      streamUrl: streamUrl.trim() || `${MASTER_CONFIG.BACKEND_URL}/api/stream?fileId=${encodeURIComponent(telegramFileId.trim())}`,
      status: 'Published',
      viewsCount: editingItem?.viewsCount || 0,
      createdAt: editingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onPublish(payload);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Quick Autofill Presets */}
      <div className="p-4 rounded-2xl bg-[#14141E] border border-[#222234] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#E50914]/20 text-[#E50914]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {editingItem ? `Editing: ${editingItem.title}` : 'Quick Content Ingestion Presets'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {editingItem ? 'Update metadata and sync with Android API' : 'Autofill ready-to-test blockbusters with verified Telegram file streams'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!editingItem ? (
            <>
              <button
                type="button"
                onClick={() => loadPreset('salaar')}
                className="px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Salaar 2
              </button>
              <button
                type="button"
                onClick={() => loadPreset('stranger')}
                className="px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Stranger Things S5
              </button>
              <button
                type="button"
                onClick={() => loadPreset('avatar')}
                className="px-3 py-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Avatar 3
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-3 py-1.5 rounded-lg bg-[#222234] text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Columns: Form Fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Section: General Info */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#222234] pb-3">
                <Film className="w-4 h-4 text-[#E50914]" />
                Media Identity & Metadata
              </h3>

              {/* Title & Tagline */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Content Title <span className="text-[#E50914]">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {omdbSource && (
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          omdbSource === 'supabase-cloud' || omdbSource === 'localStorage'
                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                            : 'bg-[#00E5FF]/20 border border-[#00E5FF]/40 text-[#00E5FF]'
                        }`}>
                          {omdbSource === 'supabase-cloud' || omdbSource === 'localStorage' ? '⚡ Cloud Cache Hit' : '🌐 OMDb Live API'}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={handleOmdbSearch}
                        disabled={isOmdbLoading}
                        className="px-2.5 py-1 rounded-lg bg-[#00E5FF]/15 hover:bg-[#00E5FF]/25 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isOmdbLoading ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Fetching OMDb...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            <span>Auto-Fetch from OMDb API</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <input
                    id="input-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Salaar 2: Shouryaanga Parvam, Stranger Things S5"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border ${
                      errors.title ? 'border-[#E50914]' : 'border-[#222234] focus:border-[#E50914]'
                    } text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
                  />
                  {errors.title && <p className="text-[11px] text-[#E50914] mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tagline / Short Logline <span className="text-[#E50914]">*</span>
                  </label>
                  <textarea
                    id="input-tagline"
                    rows={2}
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="Brief cinematic summary shown on Android OTT home carousel and hero details"
                    className={`w-full px-4 py-2.5 rounded-xl bg-[#0F0F14] border ${
                      errors.tagline ? 'border-[#E50914]' : 'border-[#222234] focus:border-[#E50914]'
                    } text-sm text-white placeholder-slate-500 focus:outline-none transition-all resize-none`}
                  />
                  {errors.tagline && <p className="text-[11px] text-[#E50914] mt-1">{errors.tagline}</p>}
                </div>
              </div>

              {/* Category, Genre, Year, Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category / Type <span className="text-[#E50914]">*</span>
                  </label>
                  <select
                    id="select-category"
                    value={category}
                    onChange={e => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-semibold text-white focus:outline-none focus:border-[#E50914] transition-all"
                  >
                    {ALL_CATEGORIES.map(c => (
                      <option key={c} value={c} className="bg-[#14141E]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Primary Genre Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Primary Genre <span className="text-[#E50914]">*</span>
                  </label>
                  <select
                    id="select-genre"
                    value={genre}
                    onChange={e => setGenre(e.target.value as GenreType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-semibold text-white focus:outline-none focus:border-[#E50914] transition-all"
                  >
                    {ALL_GENRES.map(g => (
                      <option key={g} value={g} className="bg-[#14141E]">
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Release Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Release Year <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    id="input-release-year"
                    type="number"
                    value={releaseYear}
                    onChange={e => setReleaseYear(parseInt(e.target.value, 10) || 2026)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-semibold text-white focus:outline-none focus:border-[#E50914] transition-all"
                  />
                  {errors.releaseYear && <p className="text-[11px] text-[#E50914] mt-1">{errors.releaseYear}</p>}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Duration / Episodes <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    id="input-duration"
                    type="text"
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    placeholder='e.g. "2h 15m" or "8 Episodes"'
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-semibold text-white focus:outline-none focus:border-[#E50914] transition-all"
                  />
                  {errors.duration && <p className="text-[11px] text-[#E50914] mt-1">{errors.duration}</p>}
                </div>
              </div>

              {/* Ratings & Match Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>IMDb Rating (0.0 - 10.0)</span>
                    <span className="text-amber-400 font-bold font-mono">★ {imdbRating}</span>
                  </label>
                  <input
                    id="input-imdb-rating"
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={imdbRating}
                    onChange={e => setImdbRating(parseFloat(e.target.value))}
                    className="w-full accent-[#E50914] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>OTT User Match Score</span>
                    <span className="text-emerald-400 font-bold font-mono">{matchScore}% Match</span>
                  </label>
                  <input
                    id="input-match-score"
                    type="range"
                    min="50"
                    max="100"
                    step="1"
                    value={matchScore}
                    onChange={e => setMatchScore(parseInt(e.target.value, 10))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Quality Badges: Multi-select */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Quality Badges (Multi-select)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_QUALITY_BADGES.map(badge => {
                    const isSelected = qualityBadges.includes(badge);
                    return (
                      <button
                        type="button"
                        key={badge}
                        onClick={() => toggleBadge(badge)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#E50914] text-white border border-[#E50914] shadow-md shadow-[#E50914]/30'
                            : 'bg-[#0F0F14] text-slate-400 border border-[#222234] hover:text-slate-200 hover:border-slate-500'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Section: Stream Engine & Telegram File ID */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#00E5FF]" />
                  Telegram Stream & Vercel Proxy Engine
                </h3>
                <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                  HTTP 206 Partial Content
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Telegram Video File ID (Private Channel Media Token) <span className="text-[#E50914]">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="input-telegram-file-id"
                    type="text"
                    value={telegramFileId}
                    onChange={e => setTelegramFileId(e.target.value)}
                    placeholder="e.g. BAACAgUAAxkBAAICwGV2r9Q8y9K0xZm2aP6QxZ1k8n5vAAITBwACv7eYV1xL_zKk71W0NAQ"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00E5FF] transition-all"
                  />
                  <button
                    type="button"
                    id="test-stream-btn"
                    onClick={handleGenerateStream}
                    className="px-4 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#33ebff] text-black text-xs font-bold shadow-lg shadow-[#00E5FF]/20 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Test Stream</span>
                  </button>
                </div>
                {errors.telegramFileId && (
                  <p className="text-[11px] text-[#E50914] mt-1">{errors.telegramFileId}</p>
                )}
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Paste the File ID from your private Telegram stream channel bot. The Vercel serverless proxy streams it without size limits.
                </p>
              </div>

              {/* Generated Proxy Endpoint */}
              <div className="p-3 rounded-xl bg-[#0F0F14] border border-[#222234] space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Generated Direct Stream Endpoint:</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(streamUrl);
                      onTriggerToast('info', 'Copied URL', 'Direct stream link copied to clipboard');
                    }}
                    className="text-[#00E5FF] hover:underline flex items-center gap-1 cursor-pointer font-sans text-[11px]"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <div className="text-slate-300 break-all select-all text-[11px]">
                  {streamUrl}
                </div>
              </div>

              {/* Embedded Mini HTML5 Video Player */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Play className="w-3.5 h-3.5 text-[#E50914]" />
                    Mini HTML5 Video Player (Stream Quality Preview)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setUseDemoDirectStream(!useDemoDirectStream);
                        setActivePlayerSource(!useDemoDirectStream ? SAMPLE_WORKING_STREAM : streamUrl);
                        setPlayerTested(true);
                        setStreamError(false);
                      }}
                      className="text-[11px] text-[#00E5FF] hover:underline cursor-pointer"
                    >
                      {useDemoDirectStream ? 'Use Telegram Stream' : 'Switch to 4K Demo Stream'}
                    </button>
                  </div>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black border border-[#222234] aspect-video max-h-64 flex items-center justify-center">
                  <video
                    id="mini-stream-player"
                    src={activePlayerSource || streamUrl}
                    controls
                    playsInline
                    poster={backdropUrl || posterUrl}
                    onError={() => setStreamError(true)}
                    onLoadedData={() => setStreamError(false)}
                    className="w-full h-full object-contain"
                  />

                  {streamError && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <AlertCircle className="w-6 h-6 text-amber-400" />
                      <p className="text-xs font-bold text-white">Direct Telegram Proxy Stream Waiting for Probe</p>
                      <p className="text-[11px] text-slate-400 max-w-sm">
                        Browser iframe restrictions may block cold-start Telegram streaming chunks. Click below to preview player mechanics with direct high-bitrate video.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setActivePlayerSource(SAMPLE_WORKING_STREAM);
                          setStreamError(false);
                          setUseDemoDirectStream(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#00E5FF] text-black text-xs font-bold hover:bg-[#33ebff]"
                      >
                        Load High-Speed Demo Stream
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Poster & Backdrop URLs */}
            <div className="p-6 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#222234] pb-3">
                <ImageIcon className="w-4 h-4 text-purple-400" />
                Artwork & Artwork URLs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Poster Image URL (Vertical 2:3) <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    id="input-poster-url"
                    type="url"
                    value={posterUrl}
                    onChange={e => setPosterUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white focus:outline-none focus:border-purple-400 transition-all font-mono"
                  />
                  {errors.posterUrl && <p className="text-[11px] text-[#E50914] mt-1">{errors.posterUrl}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Backdrop Image URL (Landscape 16:9) <span className="text-[#E50914]">*</span>
                  </label>
                  <input
                    id="input-backdrop-url"
                    type="url"
                    value={backdropUrl}
                    onChange={e => setBackdropUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white focus:outline-none focus:border-purple-400 transition-all font-mono"
                  />
                  {errors.backdropUrl && <p className="text-[11px] text-[#E50914] mt-1">{errors.backdropUrl}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Card Preview & Publish Action */}
          <div className="space-y-6">
            {/* Live Card Preview (Netflix Mobile / TV app appearance) */}
            <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#222234] pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Android App UI Preview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Mirror
                </span>
              </div>

              {/* Realistic Movie Card */}
              <div className="relative rounded-2xl overflow-hidden bg-[#0F0F14] border border-[#222234] shadow-xl group">
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={posterUrl}
                    alt={title || 'Movie Poster'}
                    referrerPolicy="no-referrer"
                    onError={e => {
                      (e.target as HTMLElement).setAttribute(
                        'src',
                        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80'
                      );
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F14] via-black/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded bg-[#E50914] text-white text-[10px] font-extrabold uppercase tracking-wide">
                      {category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-400">
                      ★ {imdbRating}
                    </span>
                  </div>

                  {/* Bottom details overlay */}
                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold">
                      <span className="text-emerald-400">{matchScore}% Match</span>
                      <span className="text-slate-300">{releaseYear}</span>
                      <span className="px-1.5 py-0.2 rounded border border-slate-600 text-slate-300 text-[9px]">
                        {duration}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-white leading-tight truncate">
                      {title || 'Untitled Title'}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {tagline || 'Tagline preview will appear here...'}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {qualityBadges.map(b => (
                        <span key={b} className="px-1.5 py-0.5 rounded bg-black/70 border border-white/20 text-[9px] font-bold text-white">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Publish to Android App Button */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  id="publish-to-android-btn"
                  disabled={isPublishing}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E50914] via-[#C10712] to-[#E50914] hover:from-[#f40d1a] hover:to-[#E50914] text-white text-sm font-extrabold shadow-xl shadow-[#E50914]/30 hover:shadow-2xl hover:shadow-[#E50914]/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Broadcasting to Android App...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{editingItem ? 'Update & Sync to Android' : 'Publish to Android App'}</span>
                    </>
                  )}
                </button>

                <div className="p-3 rounded-xl bg-[#0F0F14] border border-[#222234] text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span>Target API Endpoint:</span>
                    <span className="font-mono text-emerald-400 text-[10px]">POST /api/admin</span>
                  </div>
                  <p className="truncate font-mono text-[10px] text-slate-400">
                    cineflix-proxy.vercel.app
                  </p>
                  <p className="text-[10px] text-slate-400 pt-0.5">
                    Auth: <code className="text-[#00E5FF]">x-api-key</code> pre-injected automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
