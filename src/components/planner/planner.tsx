import type { Movie } from '../../domain/types';

type Props = {
  movies: Movie[];
  value: string;
  onChange: (movieId: string) => void;
};

export default function MoviePicker({ movies, value, onChange }: Props) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Selecciona una película</option>
      {movies.map(m => (
        <option key={m.id} value={m.id}>
          {m.title} ({m.durationMin} min)
        </option>
      ))}
    </select>
  );
}
