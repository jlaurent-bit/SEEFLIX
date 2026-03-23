import Header from "../components/header";
import MediaList from "../components/mediaList";
import Footer from "../components/Footer";
// données importées pour les listes
import { trending_movies as trendingMovies } from "../data/trending_movies";
import { top_shows as topTVShows } from "../data/top_shows";

import "./Home.css";

const Home = () => {
  return (
    <div>
      <Header />
      <main className="main-content">
        <MediaList title="Trending Movies" items={trendingMovies} />
        <MediaList title="Top TV Shows" items={topTVShows} />
      </main>
      <Footer />

    </div>
  );
};

export default Home;