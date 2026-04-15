import { useEffect, useState } from "react";
import Header from "../components/header";
import MediaList from "../components/mediaList";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { fetchTrendingMovies, fetchTrendingTVShows } from "../api/tmdb";

const Media = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const handleSearch = (query) => {
    const cleanedQuery = query.trim().toLowerCase();

    if (cleanedQuery === "") {
      setFilteredMedia(media);
      return;
    }

    const filtered = media.filter((item) =>
      item.title.toLowerCase().includes(cleanedQuery)
    );

    setFilteredMedia(filtered);
  };

  return (
    <div>
      <Header />
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        {error ? (
          <p>{error}</p>
        ) : loading ? (
          <p>Chargement des médias...</p>
        ) : filteredMedia.length === 0 ? (
          <p>Aucun média trouvé.</p>
        ) : (
          <MediaList title="All Media" items={filteredMedia} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Media;
