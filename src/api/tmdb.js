const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const genreCache = {
  movie: null,
  tv: null,
};

function buildUrl(path, query = {}) {
  if (!API_KEY) {
    throw new Error("TMDB API key missing. Add VITE_TMDB_API_KEY to your .env file.");
  }

  const params = new URLSearchParams({ api_key: API_KEY, ...query });
  return `${BASE_URL}${path}?${params.toString()}`;
}

function normalizeMediaItem(item, genreMap, typeOverride) {
  const mediaType = typeOverride || item.media_type || (item.title ? "movie" : "tv");
  const genres = (item.genre_ids || []).map((genreId) => genreMap?.[genreId]).filter(Boolean);

  return {
    id: `${item.id}-${mediaType}`,
    rawId: item.id,
    title: item.title || item.name || "Untitled",
    cover: item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : item.backdrop_path
      ? `${IMAGE_BASE_URL}${item.backdrop_path}`
      : "",
    rating: item.vote_average ?? "",
    type: mediaType === "tv" ? "tv" : "movie",
    genres,
  };
}

function normalizeMediaDetailItem(item, mediaType) {
  const genres = (item.genres || []).map((genre) => genre.name).filter(Boolean);
  return {
    id: `${item.id}-${mediaType}`,
    rawId: item.id,
    title: item.title || item.name || "Untitled",
    cover: item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : item.backdrop_path
      ? `${IMAGE_BASE_URL}${item.backdrop_path}`
      : "",
    rating: item.vote_average ?? "",
    type: mediaType === "tv" ? "tv" : "movie",
    genres,
    overview: item.overview || "",
    releaseDate: item.release_date || item.first_air_date || "",
    runtime:
      item.runtime ??
      (Array.isArray(item.episode_run_time) && item.episode_run_time.length > 0
        ? item.episode_run_time[0]
        : null),
    homepage: item.homepage || "",
    status: item.status || "",
    voteCount: item.vote_count ?? 0,
  };
}

async function fetchTmdb(path, query = {}) {
  const response = await fetch(buildUrl(path, query));
  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }
  return response.json();
}

async function fetchGenreMap(mediaType) {
  if (genreCache[mediaType]) {
    return genreCache[mediaType];
  }

  const data = await fetchTmdb(`/genre/${mediaType}/list`, { language: "fr-FR" });
  const map = (data.genres || []).reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  genreCache[mediaType] = map;
  return map;
}

export async function fetchTrendingMovies() {
  const genreMap = await fetchGenreMap("movie");
  const data = await fetchTmdb("/trending/movie/week");
  return (data.results || []).map((item) => normalizeMediaItem(item, genreMap, "movie"));
}

export async function fetchTrendingTVShows() {
  const genreMap = await fetchGenreMap("tv");
  const data = await fetchTmdb("/trending/tv/week");
  return (data.results || []).map((item) => normalizeMediaItem(item, genreMap, "tv"));
}

export async function searchTMDB(query) {
  if (!query.trim()) {
    return [];
  }

  const [movieGenreMap, tvGenreMap] = await Promise.all([
    fetchGenreMap("movie"),
    fetchGenreMap("tv"),
  ]);

  const data = await fetchTmdb("/search/multi", {
    query,
    language: "fr-FR",
    include_adult: "false",
  });

  return (data.results || [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) =>
      normalizeMediaItem(
        item,
        item.media_type === "tv" ? tvGenreMap : movieGenreMap,
        item.media_type
      )
    );
}

export async function fetchMediaDetails(rawId, mediaType) {
  const type = mediaType === "tv" ? "tv" : "movie";
  const data = await fetchTmdb(`/${type}/${rawId}`, { language: "fr-FR" });
  return normalizeMediaDetailItem(data, type);
}
