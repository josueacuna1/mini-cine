export type MovieType = 'REGULAR' | 'SPECIAL' | 'PREMIERE';
export type RoomSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface Movie {
  id: string;
  title: string;
  durationMin: number; 
  rating: string;
  type: MovieType;
  demandScore: number;
  releaseDate?: string;
}

export interface Room {
  id: string;
  name: string;
  size: RoomSize;
  seats?: number;
}

export interface Screening {
  id: string;
  movieId: string;
  roomId: string;
  day: number;
  start: string;
}

export interface WeekPlan {
  rooms: Room[];
  movies: Movie[];
  screenings: Screening[];
}
