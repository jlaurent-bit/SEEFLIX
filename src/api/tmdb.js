const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

function buildUrl(path, query = {}) {
  if (!API_KEY) {
    throw new Error("TMDB API key missing. Add VITE_TMDB_API_KEY to your .env file.");
  }

  const params = new URLSearchParams({ api_key: API_KEY, ...query });
  return `${BASE_URL}${path}?${params.toString()}`;
}

function normalizeMediaItem(item, typeOverride) {
  const mediaType = typeOverride || item.media_type || (item.title ? "movie" : "tv");

  return {
    id: `${item.id}-${mediaType}`,
    title: item.title || item.name || "Untitled",
    cover: item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : item.backdrop_path
      ? `${IMAGE_BASE_URL}${item.backdrop_path}`
      : "",
    rating: item.vote_average ?? "",
    type: mediaType === "tv" ? "tv" : "movie",
  };
}

async function fetchTmdb(path, query = {}) {
  const response = await fetch(buildUrl(path, query));
  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }
  return response.json();
}

export async function fetchTrendingMovies() {
  const data = await fetchTmdb("/trending/movie/week");
  return (data.results || []).map((item) => normalizeMediaItem(item, "movie"));
}

export async function fetchTrendingTVShows() {
  const data = await fetchTmdb("/trending/tv/week");
  return (data.results || []).map((item) => normalizeMediaItem(item, "tv"));
}

export async function searchTMDB(query) {
  if (!query.trim()) {
    return [];
  }

  const data = await fetchTmdb("/search/multi", {
    query,
    language: "fr-FR",
    include_adult: "false",
  });

  return (data.results || [])
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map(normalizeMediaItem);
}
