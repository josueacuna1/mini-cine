import type { WeekPlan, Screening, Movie, Room } from '../../domain/types';

export type ValidationLevel = 'ERROR' | 'WARN';
export type RuleFn = (ctx: ProposalContext) => ValidationResult[];

export interface ValidationResult {
  ruleId: string;
  level: ValidationLevel;
  message: string;
}

export interface ProposalContext {
  weekPlan: WeekPlan;
  proposal: Screening;
  movie: Movie;
  room: Room;
  virtualAdds?: import('../types').Screening[];
}

export function groupBy<T, K extends string | number>(arr: T[], key: (x: T) => K) {
  return arr.reduce<Record<K, T[]>>((acc, it) => {
    const k = key(it);
    (acc[k] ||= []).push(it);
    return acc;
  }, {} as any);
}
