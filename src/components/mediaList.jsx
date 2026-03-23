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

import MediaCard from "./mediaCard";
import "./mediaList.css";

export default function MediaList({ title, items }) {
  return (
    <section className="media-list">
      <h2>{title}</h2>
      <div className="media-items">
        {items.map((item) => (
          <MediaCard
            key={item.id}
            title={item.title}
            cover={item.cover}
            rating={item.rating}
            type={item.type}
          />
        ))}
      </div>
    </section>
  );
}