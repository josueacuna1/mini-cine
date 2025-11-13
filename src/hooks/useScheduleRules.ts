import type { WeekPlan, Screening, Movie, Room } from '../domain/types';
import type { ValidationResult } from '../domain/rules';
import { useMemo } from 'react';
import { all_rules } from '../domain/rules/all';

export function useScheduleRules(params: {
  weekPlan: WeekPlan;
  proposal: Screening | null;
  movie: Movie | null;
  room: Room | null;
}) {
  const results: ValidationResult[] = useMemo(() => {
    const { weekPlan, proposal, movie, room } = params;
    if (!proposal || !movie || !room) 
      return [];
    return all_rules.flatMap(rule => rule({ weekPlan, proposal, movie, room }));
  }, [params]);

  const hasError = results.some(r => r.level === 'ERROR');
  const errors = results.filter(r => r.level === 'ERROR');
  const warnings = results.filter(r => r.level === 'WARN');

  return { results, errors, warnings, hasError };
}
