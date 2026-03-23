import { useState } from "react";
import Header from "../components/header";
import MediaList from "../components/mediaList";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import { all_media } from "../data/all_media";

const Media = () => {
  const [filteredMedia, setFilteredMedia] = useState(all_media);

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setFilteredMedia(all_media);
    } else {
      const filtered = all_media.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredMedia(filtered);
    }
  };

  return (
    <div>
      <Header />
      <main className="main-content">
        <SearchBar onSearch={handleSearch} />
        <MediaList title="All Media" items={filteredMedia} />
      </main>
      <Footer />
    </div>
  );
};

export default Media;