import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Play, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Tv, 
  Film, 
  Radio, 
  Sparkles,
  Download,
  AlertTriangle
} from 'lucide-react';
import { ContentItem, CategoryType, GenreType } from '../types';

interface ContentLibraryProps {
  items: ContentItem[];
  onEditItem: (item: ContentItem) => void;
  onDeleteItem: (id: string, title: string) => Promise<void>;
  onPlayItem: (item: ContentItem) => void;
  onCopyUrl: (url: string) => void;
  onNavigateAdd: () => void;
}

export const ContentLibrary: React.FC<ContentLibraryProps> = ({
  items,
  onEditItem,
  onDeleteItem,
  onPlayItem,
  onCopyUrl,
  onNavigateAdd,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete confirmation dialog state
  const [deletingItem, setDeletingItem] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.telegramFileId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesGenre =
        selectedGenre === 'All' || item.genre === selectedGenre;

      return matchesSearch && matchesCategory && matchesGenre;
    });
  }, [items, searchQuery, selectedCategory, selectedGenre]);

  const handleCopyLink = (id: string, url: string) => {
    onCopyUrl(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setIsDeleting(true);
    await onDeleteItem(deletingItem.id, deletingItem.title);
    setIsDeleting(false);
    setDeletingItem(null);
  };

  const exportJsonCatalog = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cineflix_catalog_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const genresList: string[] = ['All', 'Action', 'Sci-Fi', 'Thriller', 'Comedy', 'Romance', 'Horror', 'Adventure', 'Drama', 'Anime'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter and Controls Bar */}
      <div className="p-5 rounded-2xl bg-[#14141E] border border-[#222234] space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="library-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, tagline, or Telegram file ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F0F14] border border-[#222234] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E50914] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Genre & Category Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Genre Filter */}
            <div className="flex items-center gap-1.5 bg-[#0F0F14] border border-[#222234] px-3 py-1.5 rounded-xl">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="filter-genre-select"
                value={selectedGenre}
                onChange={e => setSelectedGenre(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                {genresList.map(g => (
                  <option key={g} value={g} className="bg-[#14141E]">
                    {g === 'All' ? 'All Genres' : g}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center bg-[#0F0F14] border border-[#222234] p-1 rounded-xl">
              <button
                id="view-mode-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Poster Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="view-mode-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#E50914] text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Data Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Export Catalog */}
            <button
              onClick={exportJsonCatalog}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Download JSON Catalog"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#222234]">
          {['All', 'Movie', 'Web Series', 'Live TV'].map(cat => {
            const count =
              cat === 'All'
                ? items.length
                : items.filter(i => i.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#E50914] text-white shadow-md shadow-[#E50914]/30'
                    : 'bg-[#0F0F14] text-slate-400 border border-[#222234] hover:text-slate-200'
                }`}
              >
                <span>{cat === 'All' ? 'All Content' : cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/30 text-white' : 'bg-[#181824] text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Display: Empty State vs Grid vs Table */}
      {filteredItems.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#14141E] border border-[#222234] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#181824] border border-[#222234] flex items-center justify-center text-slate-500">
            <Film className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">No Matching Content Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No movies or series match "{searchQuery}". Try changing your filters or add a new title.
            </p>
          </div>
          <button
            onClick={onNavigateAdd}
            className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold shadow-lg shadow-[#E50914]/30 hover:bg-[#ff1420] transition-all cursor-pointer"
          >
            Add New Content
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Poster Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              id={`content-card-${item.id}`}
              className="group relative rounded-2xl overflow-hidden bg-[#14141E] border border-[#222234] hover:border-[#E50914]/50 shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Poster Container */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141E] via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      item.category === 'Movie'
                        ? 'bg-[#E50914] text-white'
                        : item.category === 'Web Series'
                        ? 'bg-[#00E5FF] text-black font-extrabold'
                        : 'bg-emerald-500 text-black font-extrabold'
                    }`}
                  >
                    {item.category}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-400">
                    ★ {item.imdbRating}
                  </span>
                </div>

                {/* Hover Play Stream Quick Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <button
                    onClick={() => onPlayItem(item)}
                    className="w-12 h-12 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-2xl shadow-[#E50914] hover:scale-110 transition-transform cursor-pointer"
                    title="Test Stream Playback"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">{item.matchScore}% Match</span>
                    <span>{item.releaseYear} • {item.duration}</span>
                  </div>

                  <h4 className="font-bold text-sm text-white truncate group-hover:text-[#00E5FF] transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                {/* Quality Badges */}
                <div className="flex flex-wrap gap-1">
                  {item.qualityBadges.slice(0, 2).map(b => (
                    <span key={b} className="px-1.5 py-0.5 rounded bg-[#0F0F14] border border-[#222234] text-[9px] font-bold text-slate-300">
                      {b}
                    </span>
                  ))}
                  {item.qualityBadges.length > 2 && (
                    <span className="px-1.5 py-0.5 rounded bg-[#0F0F14] border border-[#222234] text-[9px] font-bold text-slate-400">
                      +{item.qualityBadges.length - 2}
                    </span>
                  )}
                </div>

                {/* Actions per item: Edit, Test Playback, Delete */}
                <div className="pt-2 border-t border-[#222234] flex items-center justify-between gap-1">
                  <button
                    onClick={() => onPlayItem(item)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-[#E50914]/15 hover:bg-[#E50914] text-[#E50914] hover:text-white border border-[#E50914]/30 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                    title="Test Stream Playback"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test</span>
                  </button>

                  <button
                    onClick={() => onEditItem(item)}
                    className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] border border-[#222234] text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Edit Title & Metadata"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopyLink(item.id, item.streamUrl)}
                    className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] border border-[#222234] text-slate-300 hover:text-[#00E5FF] transition-colors cursor-pointer"
                    title="Copy Stream URL"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setDeletingItem({ id: item.id, title: item.title })}
                    className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#E50914]/20 border border-[#222234] hover:border-[#E50914]/50 text-slate-400 hover:text-[#E50914] transition-colors cursor-pointer"
                    title="Delete from Library & API"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Data Table View */
        <div className="rounded-2xl bg-[#14141E] border border-[#222234] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#181824] border-b border-[#222234] text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Title & Artwork</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Genre</th>
                  <th className="py-3.5 px-3">Year / Duration</th>
                  <th className="py-3.5 px-3">IMDb Rating</th>
                  <th className="py-3.5 px-3">Quality</th>
                  <th className="py-3.5 px-3">Telegram File ID</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222234]">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-[#181824]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.posterUrl}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-10 h-14 object-cover rounded-lg border border-[#222234] shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-white truncate hover:text-[#00E5FF] transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">{item.tagline}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300 font-medium">
                      {item.genre}
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <div>{item.releaseYear}</div>
                      <div className="text-[11px] text-slate-400">{item.duration}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="text-amber-400 font-bold">★ {item.imdbRating}</span>
                      <div className="text-[10px] text-emerald-400">{item.matchScore}% Match</div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {item.qualityBadges.map(b => (
                          <span key={b} className="px-1.5 py-0.5 rounded bg-[#0F0F14] border border-[#222234] text-[9px] font-bold text-slate-300">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      <div className="truncate max-w-[130px]" title={item.telegramFileId}>
                        {item.telegramFileId}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPlayItem(item)}
                          className="p-1.5 rounded-lg bg-[#E50914]/15 hover:bg-[#E50914] text-[#E50914] hover:text-white transition-colors cursor-pointer"
                          title="Test Stream Playback"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <button
                          onClick={() => onEditItem(item)}
                          className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyLink(item.id, item.streamUrl)}
                          className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#222234] text-slate-300 hover:text-[#00E5FF] transition-colors cursor-pointer"
                          title="Copy Stream Link"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setDeletingItem({ id: item.id, title: item.title })}
                          className="p-1.5 rounded-lg bg-[#181824] hover:bg-[#E50914]/20 text-slate-400 hover:text-[#E50914] transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#14141E] border border-[#222234] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914] mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Media Item?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <strong className="text-white">"{deletingItem.title}"</strong>?
                This will trigger a DELETE request to <code className="text-[#00E5FF]">/api/admin</code> and remove it from Android user feeds.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-[#181824] hover:bg-[#222234] border border-[#222234] text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#f40d1a] text-white text-xs font-bold shadow-lg shadow-[#E50914]/30 transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
