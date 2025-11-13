import type { RuleFn } from './index';

export const longMovieRoomRule: RuleFn = ({ movie, room }) => {
  if (movie.durationMin > 150 && room.size === 'SMALL') {
    return [{
      ruleId: 'long.no-small',
      level: 'ERROR',
      message: 'Las películas de más de 150 min no pueden programarse en sala chica.',
    }];
  }
  return [];
};