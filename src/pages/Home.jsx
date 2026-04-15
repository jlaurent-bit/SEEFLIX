import { useEffect, useState } from "react";
import Header from "../components/header";
import MediaList from "../components/mediaList";
import Footer from "../components/Footer";
import { fetchTrendingMovies, fetchTrendingTVShows } from "../api/tmdb";

import "./Home.css";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topTVShows, setTopTVShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLists = async () => {
      setLoading(true);
      try {
        const [movies, shows] = await Promise.all([
          fetchTrendingMovies(),
          fetchTrendingTVShows(),
        ]);
        setTrendingMovies(movies);
        setTopTVShows(shows);
      } catch (e) {
        setError("Impossible de charger les listes.");
      } finally {
        setLoading(false);
      }
    };

    loadLists();
  }, []);

  return (
    <div>
      <Header />
      <main className="main-content">
        {error ? (
          <p>{error}</p>
        ) : loading ? (
          <p>Chargement des listes...</p>
        ) : (
          <>
            <MediaList title="Trending Movies" items={trendingMovies} />
            <MediaList title="Top TV Shows" items={topTVShows} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
