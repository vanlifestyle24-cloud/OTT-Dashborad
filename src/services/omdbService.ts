export interface OmdbMovieResult {
  title: string;
  tagline: string;
  releaseYear: number;
  duration: string;
  imdbRating: number;
  genre: string;
  posterUrl: string;
  backdropUrl: string;
  matchScore: number;
}

export type CacheSource = 'localStorage' | 'supabase-cloud' | 'omdb-live';

export interface OmdbFetchResponse {
  result: OmdbMovieResult;
  source: CacheSource;
}

const PRIMARY_API_KEY = '38df43c1';
const BACKUP_API_KEY = '71610ba3';

const SUPABASE_URL = 'https://sjdlejiwqmkyfkvmodgd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_YAv53hX7HhPdxBcsiZpKEA_JHKMmGAt';
const SUPABASE_TABLE = 'cached_movies';

// Helper to convert minutes string into formatted duration
function convertRuntime(runtimeStr: string): string {
  if (!runtimeStr || runtimeStr === 'N/A') return '2h 15m';
  const match = runtimeStr.match(/(\d+)\s*min/i);
  if (!match) return runtimeStr;
  const totalMins = parseInt(match[1], 10);
  if (isNaN(totalMins)) return '2h 15m';
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export async function fetchMovieFromOmdb(title: string): Promise<OmdbFetchResponse | null> {
  const trimmed = title.trim();
  if (!trimmed) return null;

  const cleanTitle = trimmed.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cacheKey = `omdb_cache_${cleanTitle}`;

  // Step A: Check local cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.title) {
        return {
          result: parsed,
          source: 'localStorage',
        };
      }
    }
  } catch (e) {
    // ignore local cache read error
  }

  // Step B: Query Supabase REST API
  try {
    const sbUrl = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}?title=ilike.*${encodeURIComponent(cleanTitle)}*`;
    const sbRes = await fetch(sbUrl, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    if (sbRes.ok) {
      const sbData = await sbRes.json();
      if (Array.isArray(sbData) && sbData.length > 0) {
        const item = sbData[0];
        // Parse stored JSON or fields
        const movieResult: OmdbMovieResult = {
          title: item.title || trimmed,
          tagline: item.tagline || item.plot || 'An epic cinematic journey.',
          releaseYear: parseInt(item.release_year || item.releaseYear, 10) || 2026,
          duration: item.duration || '2h 15m',
          imdbRating: parseFloat(item.imdb_rating || item.imdbRating) || 8.0,
          genre: item.genre || 'Action',
          posterUrl: item.poster_url || item.posterUrl || '',
          backdropUrl: item.backdrop_url || item.backdropUrl || item.poster_url || '',
          matchScore: parseInt(item.match_score || item.matchScore, 10) || 95,
        };

        // Cache in localStorage for subsequent fast reads
        try {
          localStorage.setItem(cacheKey, JSON.stringify(movieResult));
        } catch (e) {}

        return {
          result: movieResult,
          source: 'supabase-cloud',
        };
      }
    }
  } catch (err) {
    // Supabase query failed, fallback to OMDb API
  }

  // Step D: Fetch from OMDb API
  let data: any = null;
  try {
    const url1 = `https://www.omdbapi.com/?apikey=${PRIMARY_API_KEY}&t=${encodeURIComponent(trimmed)}`;
    const res1 = await fetch(url1);
    const json1 = await res1.json();
    if (json1 && json1.Response === 'True') {
      data = json1;
    }
  } catch (err) {
    // primary failed
  }

  if (!data || data.Response !== 'True') {
    try {
      const url2 = `https://www.omdbapi.com/?apikey=${BACKUP_API_KEY}&t=${encodeURIComponent(trimmed)}`;
      const res2 = await fetch(url2);
      const json2 = await res2.json();
      if (json2 && json2.Response === 'True') {
        data = json2;
      }
    } catch (err) {
      // backup failed
    }
  }

  if (!data || data.Response !== 'True') {
    throw new Error(data?.Error || 'Movie not found in OMDb database');
  }

  const imdbRatingNum = parseFloat(data.imdbRating);
  const validImdb = !isNaN(imdbRatingNum) ? imdbRatingNum : 8.0;

  let firstGenre = 'Action';
  if (data.Genre && data.Genre !== 'N/A') {
    const genres = data.Genre.split(',').map((g: string) => g.trim());
    if (genres.length > 0 && genres[0]) {
      firstGenre = genres[0];
    }
  }

  const result: OmdbMovieResult = {
    title: data.Title || trimmed,
    tagline: data.Plot && data.Plot !== 'N/A' ? data.Plot : 'An epic cinematic journey on the OTT streaming vault.',
    releaseYear: parseInt(data.Year, 10) || 2026,
    duration: convertRuntime(data.Runtime),
    imdbRating: validImdb,
    genre: firstGenre,
    posterUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : '',
    backdropUrl: data.Poster && data.Poster !== 'N/A' ? data.Poster : '',
    matchScore: Math.min(99, Math.round(validImdb * 10 + 10)),
  };

  // Save to localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch (e) {}

  // Asynchronously save to Supabase table via POST so it is cached forever for everyone
  try {
    fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        title: cleanTitle,
        original_title: result.title,
        tagline: result.tagline,
        release_year: result.releaseYear,
        duration: result.duration,
        imdb_rating: result.imdbRating,
        genre: result.genre,
        poster_url: result.posterUrl,
        backdrop_url: result.backdropUrl,
        match_score: result.matchScore,
      }),
    }).catch(() => {});
  } catch (e) {}

  return {
    result,
    source: 'omdb-live',
  };
}
