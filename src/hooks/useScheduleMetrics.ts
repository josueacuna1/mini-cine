import type { WeekPlan, Room, Movie } from '../domain/types';
import { useMemo } from 'react';
import { addMin, normalizeTimeOverflow, toMin } from '../utils/timeUtils';
import { cleaning_min_by_room, day_available_min, default_seats_by_room } from '../domain/constants';

export interface RoomDayMetrics {
  day: number;
  roomId: string;
  roomName: string;
  roomSize: Room['size'];
  screenings: Array<{
    id: string;
    start: string;
    end: string;
    movieTitle: string;
    durationMin: number;
  }>;
  occupiedMin: number;
  usagePct: number;
  idleMin: number;
  capacityEst: number;
}

export interface DayTotals {
  day: number;
  occupiedMin: number;
  usagePct: number;
  idleMin: number;
  capacityEst: number;
  screeningsCount: number;
}

const clamp = (x: number, min = 0, max = 100) => Math.max(min, Math.min(max, x));
const capTo = (value: number, max: number) => Math.min(Math.max(0, value), max);
const pct = (num: number, den: number) => (den ? (num / den) * 100 : 0);
const sumBy = <T,>(arr: T[], sel: (t: T) => number) => arr.reduce((a, t) => a + sel(t), 0);

function overlapMinutes(a1: number, a2: number, b1: number, b2: number): number {
  const s = Math.max(a1, b1);
  const e = Math.min(a2, b2);
  return Math.max(0, e - s);
}

function mergeIntervals(
  intervals: Array<[number, number]>,
  toleranceMin = 0
): Array<[number, number]> {
  if (!intervals.length)
    return [];

  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out: Array<[number, number]> = [];
  let [curS, curE] = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const [s, e] = sorted[i];

    if (s <= curE + toleranceMin) {
      curE = Math.max(curE, e);
    } else {
      out.push([curS, curE]);
      [curS, curE] = [s, e];
    }
  }

  out.push([curS, curE]);
  return out;
}

function computeRoomDayMetrics(
  day: number,
  room: Room,
  moviesById: Map<string, Movie>,
  weekPlan: WeekPlan,
  dayStartMin: number,
  dayEndMin: number
): RoomDayMetrics {
  const screenings = weekPlan.screenings
    .filter(s => s.day === day && s.roomId === room.id)
    .sort((a, b) => a.start.localeCompare(b.start));

  const seats = room.seats ?? default_seats_by_room[room.size];
  const timeToClean = cleaning_min_by_room[room.size];

  const rows: RoomDayMetrics['screenings'] = [];
  const intervals: Array<[number, number]> = [];
  let capacityEst = 0;

  for (const s of screenings) {
    const movie = moviesById.get(s.movieId);
    if (!movie)
      continue;

    const block = movie.durationMin + timeToClean;
    const endStr = normalizeTimeOverflow(addMin(s.start, block));

    rows.push({
      id: s.id,
      start: s.start,
      end: endStr,
      movieTitle: movie.title,
      durationMin: movie.durationMin,
    });

    const startMin = toMin(s.start);
    intervals.push([startMin, startMin + block]);
    capacityEst += seats;
  }

  const merged = mergeIntervals(intervals, 1);
  const occupiedInWindow = sumBy(merged, ([s, e]) =>
    overlapMinutes(s, e, dayStartMin, dayEndMin)
  );

  const availableMinForRoom = day_available_min;
  const occupiedMin = capTo(occupiedInWindow, availableMinForRoom);
  const usagePct = clamp(pct(occupiedMin, availableMinForRoom));
  const idleMin = Math.max(0, availableMinForRoom - occupiedMin);

  return {
    day,
    roomId: room.id,
    roomName: room.name,
    roomSize: room.size,
    screenings: rows,
    occupiedMin,
    usagePct,
    idleMin,
    capacityEst,
  };
}

export function useScheduleMetrics(weekPlan: WeekPlan) {
  return useMemo(() => {
    const moviesById = new Map<string, Movie>(weekPlan.movies.map(m => [m.id, m]));
    const dayStartMin = toMin('10:00');
    const dayEndMin = 24 * 60;
    const roomsCount = weekPlan.rooms.length;
    const daysCount = 7;

    const details: RoomDayMetrics[] = Array.from({ length: daysCount }, (_, i) => i + 1)
      .flatMap(day =>
        weekPlan.rooms.map(room =>
          computeRoomDayMetrics(day, room, moviesById, weekPlan, dayStartMin, dayEndMin)
        )
      );

    const days: DayTotals[] = Array.from({ length: daysCount }, (_, i) => i + 1).map(day => {
      const slice = details.filter(d => d.day === day);
      const availableMin = day_available_min * roomsCount;
      const occupiedMin = capTo(sumBy(slice, r => r.occupiedMin), availableMin);
      const capacityEst = sumBy(slice, r => r.capacityEst);
      const screeningsCount = sumBy(slice, r => r.screenings.length);
      const usagePct = clamp(pct(occupiedMin, availableMin));
      const idleMin = Math.max(0, availableMin - occupiedMin);

      return {
        day,
        occupiedMin,
        usagePct,
        idleMin,
        capacityEst,
        screeningsCount,
      };
    });

    const weekAvailable = day_available_min * roomsCount * daysCount;
    const weekOccupied = capTo(sumBy(days, d => d.occupiedMin), weekAvailable);
    const weekCapacity = sumBy(days, d => d.capacityEst);
    const weekShows = sumBy(days, d => d.screeningsCount);
    const weekUsagePct = clamp(pct(weekOccupied, weekAvailable));
    const weekIdle = Math.max(0, weekAvailable - weekOccupied);

    const week = {
      occupiedMin: weekOccupied,
      capacityEst: weekCapacity,
      screeningsCount: weekShows,
      usagePct: weekUsagePct,
      idleMin: weekIdle,
    };

    return { details, days, week };
  }, [weekPlan]);
}
