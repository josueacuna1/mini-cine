import type { ChangeEvent } from 'react';

type MovieType = 'ALL' | 'REGULAR' | 'SPECIAL' | 'PREMIERE';
type Props = {
  search: string;
  onSearch: (v: string) => void;
  type: MovieType;
  onType: (t: MovieType) => void;
  rating: 'ALL' | string;
  onRating: (r: string) => void;
  minDemand: number;
  onMinDemand: (n: number) => void;
  ratings: string[];
};

export default function MovieFilters({
  search, onSearch,
  type, onType,
  rating, onRating,
  minDemand, onMinDemand,
  ratings
}: Props) {
  const handleType = (e: ChangeEvent<HTMLSelectElement>) => {
    onType(e.target.value as MovieType);
  };

  const handleRating = (e: ChangeEvent<HTMLSelectElement>) => {
    onRating(e.target.value);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleDemand = (e: ChangeEvent<HTMLInputElement>) => {
    onMinDemand(Number(e.target.value));
  };

  return (
    <div className="catalog-panel">
      <div className="catalog-panel__card">
        <label className="catalog-panel__label">Buscar</label>
        <input
          className="catalog__input"
          type="text"
          placeholder="Título…"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="catalog-panel__card">
        <label className="catalog-panel__label">Tipo</label>
        <select
          className="catalog__select"
          value={type}
          onChange={handleType}
        >
          <option value="ALL">Todos</option>
          <option value="REGULAR">Regular</option>
          <option value="SPECIAL">Special</option>
          <option value="PREMIERE">Premiere</option>
        </select>
      </div>

      <div className="catalog-panel__card">
        <label className="catalog-panel__label">Clasificación</label>
        <select
          className="catalog__select"
          value={rating}
          onChange={handleRating}
        >
          <option value="ALL">Todas</option>
          {ratings.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="catalog-panel__card range-wrap">
        <label>Demanda mínima: {minDemand}</label>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={minDemand}
          onChange={handleDemand}
        />
      </div>
    </div>
  );
}
