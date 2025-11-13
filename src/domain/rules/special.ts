import type { RuleFn } from './index';

export const specialWeekendRule: RuleFn = ({ proposal, movie }) => {
  if (movie.type !== 'SPECIAL') 
    return [];

  if (![5,6,7].includes(proposal.day)) {
    return [{
      ruleId: 'special.weekend',
      level: 'ERROR',
      message: 'Las funciones SPECIAL sólo pueden programarse de viernes a domingo.',
    }];
  }
  return [];
};
