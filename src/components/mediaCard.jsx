/*3. Composant MediaCard (Réutilisable)
Un composant réutilisable nommé MediaCard doit être implémenté pour afficher les
informations d’un média individuel.
Props attendues
● title (string) : Le titre du film ou de la série
● cover (string) : L’image de couverture (affiche/poster)
● rating (number ou string) : La note du média
● type (string) : Le type du média (movie ou tvshow)
Chaque MediaCard doit afficher :
● L’image de couverture
● Le titre
● La note
● Le type*/


import "./mediaCard.css";

export default function MediaCard({ title, cover, rating, type, genres = [] }) {
  const genreLabel = genres.length > 0 ? genres.slice(0, 2).join(" · ") : null;

  return (
    <div className="media-card">
      <img src={cover} alt={title} />
      <div className="card-info">
        <h3>{title}</h3>
        {genreLabel && <p className="media-genres">{genreLabel}</p>}
        <p className="rating">⭐ {rating}</p>
        <span className="media-type">{type === "movie" ? "Film" : "Série"}</span>
      </div>
    </div>
  );
}
