import type { RuleFn } from './index';
import { hour_start, hour_end, toMin } from '../../utils/timeUtils';

export const timeWindowRule: RuleFn = ({ proposal }) => {
  const start = toMin(proposal.start);
  
  if (start < toMin(hour_start) || start >= toMin(hour_end)) {
    return [{
      ruleId: 'time.window',
      level: 'ERROR',
      message: `La hora debe estar entre ${hour_start} y 23:59.`,
    }];
  }
  return [];
};