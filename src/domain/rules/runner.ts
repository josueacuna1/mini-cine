import type { WeekPlan, Screening, Movie, Room } from '../../domain/types';
import type { ValidationResult } from './index';
import { all_rules } from './all';

export function runAllRules(params: {
  weekPlan: WeekPlan;
  proposal: Screening;
  movie: Movie;
  room: Room;
  virtualAdds?: Screening[];
}): ValidationResult[] {
  const { weekPlan, proposal, movie, room, virtualAdds = [] } = params;

  const wp: WeekPlan = virtualAdds.length
    ? { ...weekPlan, screenings: [...weekPlan.screenings, ...virtualAdds] }
    : weekPlan;

  return all_rules.flatMap(rule => rule({
    weekPlan: wp,
    proposal,
    movie,
    room
  }));
}
