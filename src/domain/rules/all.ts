import type { RuleFn } from './index';
import { timeWindowRule } from './time-window';
import { overlapRule } from './overlap';
import { specialWeekendRule } from './special';
import { longMovieRoomRule } from './long-movie';
import { highDemandRule } from './high-demand'
import { premiereRules } from './premiere';

export const all_rules: RuleFn[] = [
  timeWindowRule,
  overlapRule,
  specialWeekendRule,
  longMovieRoomRule,
  highDemandRule,
  premiereRules,
];
