import type { WeekPlan } from '../domain/types';
import { adaptMovies, adaptRooms } from '../domain/adapters';

export function buildInitialWeekPlan(): WeekPlan {
  return {
    rooms: adaptRooms(),
    movies: adaptMovies(),
    screenings: [],
  };
}
