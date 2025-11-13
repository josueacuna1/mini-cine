import type { RuleFn } from './index';
import { toMin } from '../../utils/timeUtils';

export const highDemandRule: RuleFn = ({ weekPlan, proposal, movie }) => {
  if (movie.demandScore < 70) 
    return [];
  
  const sameDayStarts = weekPlan.screenings
    .filter(s => s.day === proposal.day && s.movieId === movie.id)
    .map(s => s.start)
    .sort();
  
  const cutoff = '14:00';
  const existingFirst = sameDayStarts[0] ?? null;
  const isFirst = !existingFirst || toMin(proposal.start) < toMin(existingFirst);

  if (isFirst && toMin(proposal.start) >= toMin(cutoff)) {
    return [{
      ruleId: 'demand.first-before-14',
      level: 'ERROR',
      message: 'Alta demanda (≥70): la primera función del día debe iniciar antes de las 14:00.',
    }];
  }
  return [];
};
