import type { Movie } from '../../domain/types';
import './catalog.css';

export default function MovieList({ movies }: { movies: Movie[] }) {
  if (!movies.length) 
    return <p className="movie-empty">No hay resultados.</p>;

  return (
    <div className="movie-list">
      {movies.map(m => (
        <article key={m.id} className="movie-card">
          <header>
            <div className="movie-title">{m.title}</div>
            <div className="movie-badges">
              {m.type === 'REGULAR' && <span className="badge regular">REGULAR</span>}
              {m.type === 'SPECIAL' && <span className="badge special">SPECIAL</span>}
              {m.type === 'PREMIERE' && <span className="badge premiere">PREMIERE</span>}
              {m.demandScore >= 70 && <span className="badge high">High demand</span>}
            </div>
          </header>

          <div className="movie-meta">
            <div>Duración: <span>{m.durationMin} min</span></div>
            <div>Clasificación: <span>{m.rating}</span></div>
            <div>Demanda: <span>{m.demandScore}</span></div>
            {m.releaseDate && <div>Fecha: <span>{m.releaseDate}</span></div>}
          </div>
        </article>
      ))}
    </div>
  );
}
