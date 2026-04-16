import { useEffect, useMemo, useState } from "react";
import Header from "../components/header";
import MediaList from "../components/mediaList";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import {
  fetchTrendingMovies,
  fetchTrendingTVShows,
  searchTMDB,
  fetchMediaDetails,
} from "../api/tmdb";
import "./Media.css";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("seeflixFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const loadMedia = async () => {
      setLoading(true);
      try {
        const [movies, tvShows] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingTVShows(),
        ]);
        const allMedia = [...movies, ...tvShows];
        setMedia(allMedia);
        setFilteredMedia(allMedia);
      } catch (e) {
        setError("Impossible de charger les médias.");
      } finally {
        setLoading(false);
      }
    };

    loadMedia();
  }, []);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites]
  );

  const handleSearch = async (query) => {
    const cleanedQuery = query.trim();

    if (cleanedQuery === "") {
      setFilteredMedia(media);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchTMDB(cleanedQuery);
      setFilteredMedia(results);
    } catch (e) {
      setError("Impossible de rechercher les médias.");
      setFilteredMedia([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (item) => {
    setFavorites((current) => {
      const exists = current.some((fav) => fav.id === item.id);
      const updated = exists
        ? current.filter((fav) => fav.id !== item.id)
        : [...current, item];
      localStorage.setItem("seeflixFavorites", JSON.stringify(updated));
      return updated;
    });
  };

  const openDetails = async (item) => {
    setDetailsError(null);
    setDetailsLoading(true);
    try {
      const details = await fetchMediaDetails(item.rawId, item.type);
      setSelectedMedia(details);
    } catch (e) {
      setDetailsError("Impossible de charger les détails du média.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedMedia(null);
    setDetailsError(null);
  };

  return (
    <div>
      <Header />
      <main className="main-content media-page">
        <SearchBar onSearch={handleSearch} />

        {error ? (
          <p className="media-message error">{error}</p>
        ) : loading ? (
          <p className="media-message">Chargement des médias...</p>
        ) : filteredMedia.length === 0 ? (
          <p className="media-message">Aucun média trouvé.</p>
        ) : (
          <MediaList
            title="Résultats"
            items={filteredMedia}
            onCardClick={openDetails}
            onToggleFavorite={toggleFavorite}
            favoriteIds={favoriteIds}
          />
        )}

        {favorites.length > 0 && (
          <MediaList
            title="Favoris"
            items={favorites}
            onCardClick={openDetails}
            onToggleFavorite={toggleFavorite}
            favoriteIds={favoriteIds}
          />
        )}
      </main>

      <Footer />

      {selectedMedia && (
        <div className="media-detail-overlay" onClick={closeDetails}>
          <div
            className="media-detail-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-detail"
              onClick={closeDetails}
              aria-label="Fermer"
            >
              ×
            </button>
            <img src={selectedMedia.cover} alt={selectedMedia.title} />
            <div className="media-detail-content">
              <h2>{selectedMedia.title}</h2>
              <p className="detail-type">
                {selectedMedia.type === "movie" ? "Film" : "Série"}
                {selectedMedia.releaseDate && ` • ${selectedMedia.releaseDate}`}
              </p>
              <p className="detail-genres">
                {selectedMedia.genres.join(" · ")}
              </p>
              <p className="detail-rating">⭐ {selectedMedia.rating} / 10</p>
              <p className="detail-overview">
                {selectedMedia.overview ||
                  "Aucune description disponible pour ce média."}
              </p>
              {selectedMedia.runtime && (
                <p className="detail-runtime">
                  Durée : {selectedMedia.runtime} minutes
                </p>
              )}
              {selectedMedia.status && (
                <p className="detail-status">Statut : {selectedMedia.status}</p>
              )}
              {selectedMedia.homepage && (
                <p className="detail-homepage">
                  <a
                    href={selectedMedia.homepage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Site officiel
                  </a>
                </p>
              )}
              {detailsLoading && <p>Chargement des détails...</p>}
              {detailsError && <p className="media-message error">{detailsError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Media;
