import type { RuleFn } from './index';
import { overlaps, addMin } from '../../utils/timeUtils';
import { cleaning_min_by_room } from '../../domain/constants';

export const overlapRule: RuleFn = ({ weekPlan, proposal, movie, room }) => {
  const cleaning = cleaning_min_by_room[room.size];
  const end = addMin(proposal.start, movie.durationMin + cleaning);
  const sameDayRoom = weekPlan.screenings.filter(s => s.day === proposal.day && s.roomId === room.id && s.id !== proposal.id);

  for (const s of sameDayRoom) {
    const m = weekPlan.movies.find(x => x.id === s.movieId);

    if (!m) 
      continue;
    const sEnd = addMin(s.start, m.durationMin + cleaning_min_by_room[room.size]);
    
    if (overlaps(proposal.start, end, s.start, sEnd)) {
      return [{
        ruleId: 'overlap.same-room',
        level: 'ERROR',
        message: `Empalme con función existente a las ${s.start} hrs en la ${room.name}.`,
      }];
    }
  }
  return [];
};
