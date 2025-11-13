import type { RuleFn } from './index';

export const premiereRules: RuleFn = ({ weekPlan, proposal, movie }) => {
  if (!movie || movie.type !== 'PREMIERE') 
    return [];

  if (proposal.day !== 4) 
    return [];
  
  const existingCount = weekPlan.screenings
    .filter(s => s.day === proposal.day && s.movieId === movie.id).length;

  if (existingCount >= 2) 
    return [];

  const message =
    existingCount === 0
      ? 'Se deben agendar 2 horarios por tratarse de un estreno en la categoría PREMIERE. El formulario te pedirá dos horarios.'
      : 'Jueves (PREMIERE): ya tienes una función, agrega una segunda para cumplir el requisito.';

  return [{
    ruleId: 'premiere.thursday.warn',
    level: 'WARN',
    message,
  }];
};
