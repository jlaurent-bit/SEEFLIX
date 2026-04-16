/*2. Composant MediaList (Réutilisable)
Un composant réutilisable nommé MediaList doit être créé.
Rôle
Le composant MediaList est responsable de l’affichage d’une liste de composants MediaCard.
Props attendues
● title (string) : Le titre de la section (ex. : « Trending Movies », « Top TV Shows »).
● items (array) : Un tableau contenant les films ou les séries à afficher.
La page Home doit contenir :
● Une MediaList pour les Trending Movies
● Une MediaList pour les Top TV Shows*/

import { useEffect, useMemo, useRef, useState } from "react";
import MediaCard from "./mediaCard";
import "./mediaList.css";

export default function MediaList({
  title,
  items,
  onCardClick,
  onToggleFavorite,
  favoriteIds,
}) {
  const wrapperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setCurrentIndex(0);
  }, [items]);

  useEffect(() => {
    const updateSizes = () => {
      const wrapper = wrapperRef.current;
      const firstCard = wrapper?.querySelector(".media-card");
      if (wrapper && firstCard) {
        const cardRect = firstCard.getBoundingClientRect();
        const wrapperRect = wrapper.getBoundingClientRect();
        const gap = 16;
        setCardWidth(cardRect.width + gap);
        setVisibleCount(Math.max(1, Math.floor((wrapperRect.width + gap) / cardRect.width)));
      }
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, [items]);

  const maxIndex = Math.max(0, items.length - visibleCount);

  const handlePrev = () => setCurrentIndex((current) => Math.max(0, current - 1));
  const handleNext = () => setCurrentIndex((current) => Math.min(maxIndex, current + 1));

  const translateX = useMemo(
    () => `translateX(-${currentIndex * cardWidth}px)`,
    [currentIndex, cardWidth]
  );

  return (
    <section className="media-list">
      <div className="media-list-header">
        <h2>{title}</h2>
        <div className="media-controls">
          <button
            type="button"
            className="scroll-button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Précédent"
          >
            ‹
          </button>
          <button
            type="button"
            className="scroll-button"
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Suivant"
          >
            ›
          </button>
        </div>
      </div>
      <div className="media-items-wrapper" ref={wrapperRef}>
        <div className="media-items" style={{ transform: translateX }}>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              title={item.title}
              cover={item.cover}
              rating={item.rating}
              type={item.type}
              genres={item.genres}
              onOpenDetails={() => onCardClick?.(item)}
              onToggleFavorite={() => onToggleFavorite?.(item)}
              isFavorite={favoriteIds?.has(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
