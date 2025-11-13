import type { Movie, Room } from './types';
import rawMovies from '../data/movies.json';
import rawScreens from '../data/screens.json';

type RawMovie = {
  id: string;
  title: string;
  runtimeMin: number;
  rating: string;
  type: 'REGULAR' | 'SPECIAL' | 'PREMIERE';
  demandScore: number;
  releaseDate?: string;
};

type RawScreen = {
  id: string;
  name: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  seats?: number;
};

export function adaptMovies(): Movie[] {
  return (rawMovies as RawMovie[]).map(m => ({
    id: m.id,
    title: m.title,
    durationMin: m.runtimeMin,
    rating: m.rating,
    type: m.type,
    demandScore: m.demandScore,
    releaseDate: m.releaseDate,
  }));
}

export function adaptRooms(): Room[] {
  return (rawScreens as RawScreen[]).map(r => ({
    id: r.id,
    name: r.name,
    size: r.size,
    seats: r.seats,
  }));
}