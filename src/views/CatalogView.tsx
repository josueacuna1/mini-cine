import type { WeekPlan, Movie } from '../domain/types';
import { useMemo, useState } from 'react';
import MovieFilters from '../components/catalog/MovieFilters';
import MovieList from '../components/catalog/MovieList';

export default function CatalogView({ weekPlan }: { weekPlan: WeekPlan }) {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'ALL' | 'REGULAR' | 'SPECIAL' | 'PREMIERE'>('ALL');
  const [rating, setRating] = useState<'ALL' | string>('ALL');
  const [minDemand, setMinDemand] = useState(0);

  const ratings = useMemo(
    () => [...new Set(weekPlan.movies.map(m => m.rating))].sort(),
    [weekPlan.movies]
  );

  const filteredMovies: Movie[] = useMemo(() => {
    const q = search.toLowerCase();
    return weekPlan.movies.filter(m => {
      const okText = m.title.toLowerCase().includes(q);
      const okType = type === 'ALL' ? true : m.type === type;
      const okRating = rating === 'ALL' ? true : m.rating === rating;
      const okDemand = m.demandScore >= minDemand;
      
      return okText && okType && okRating && okDemand;
    });
  }, [weekPlan.movies, search, type, rating, minDemand]);

  return (
    <section className="view-animate">
      <h2>Catálogo de películas</h2>
      <MovieFilters
        search={search} onSearch={setSearch}
        type={type} onType={setType}
        rating={rating} onRating={setRating}
        minDemand={minDemand} onMinDemand={setMinDemand}
        ratings={ratings}
      />
      <MovieList movies={filteredMovies} />
    </section>
  );
}
