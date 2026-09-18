export type CategoryType = 'Movie' | 'Web Series' | 'Live TV';

export type GenreType = 
  | 'Action' 
  | 'Sci-Fi' 
  | 'Thriller' 
  | 'Comedy' 
  | 'Romance' 
  | 'Horror' 
  | 'Adventure' 
  | 'Drama' 
  | 'Fantasy' 
  | 'Anime';

export type QualityBadge = '4K UHD' | 'HDR10+' | 'Dolby Atmos' | '5.1' | 'FHD 1080p';

export interface ContentItem {
  id: string;
  title: string;
  tagline: string;
  category: CategoryType;
  genre: GenreType;
  releaseYear: number;
  duration: string;
  imdbRating: number;
  matchScore: number;
  posterUrl: string;
  backdropUrl: string;
  qualityBadges: QualityBadge[];
  telegramFileId: string;
  streamUrl: string;
  status: 'Published' | 'Draft' | 'Processing';
  viewsCount: number;
  createdAt: string;
  updatedAt?: string;
  seasonsCount?: number;
  episodesCount?: number;
}

export interface AppSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  announcementBanner: string;
  showAnnouncement: boolean;
  telegramChannelLink: string;
  telegramChannelId: string;
  backendUrl: string;
  apiKey: string;
  edgeCacheTtlHours: number;
  autoTranscode: boolean;
}

export interface StreamTestDiagnostic {
  testedAt: string;
  fileId: string;
  streamUrl: string;
  httpStatus: number;
  statusText: string;
  isPartialContent206: boolean;
  contentRangeHeader?: string;
  contentLength?: string;
  contentType?: string;
  responseTimeMs: number;
  resolution?: string;
  bitrate?: string;
  playable: boolean;
  notes?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
