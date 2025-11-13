import type { Dispatch, SetStateAction } from 'react';
import type { WeekPlan, Room, Movie, Screening } from '../../domain/types';
import type { ValidationResult } from '../../domain/rules';
import { useEffect, useMemo, useState } from 'react';
import { runAllRules } from '../../domain/rules/runner';
import { cleaning_min_by_room } from '../../domain/constants';
import { toMin, addMin, hour_start, hour_end } from '../../utils/timeUtils';
import MoviePicker from './MoviePicker';
import TimePicker from './TimePicker';
import ValidationAlerts from './ValidationAlerts';

type Props = {
  weekPlan: WeekPlan;
  setWeekPlan: Dispatch<SetStateAction<WeekPlan>>;
  day: number;
  room: Room;
  editing: Screening | null;
  setEditing: Dispatch<SetStateAction<Screening | null>>; 
};

export default function CreateScreeningForm({ weekPlan, setWeekPlan, day, room, editing, setEditing }: Props) {
  const [movieId, setMovieId] = useState('');
  const [singleStart, setSingleStart] = useState('10:00');
  const [startA, setStartA] = useState('10:00');
  const [startB, setStartB] = useState('13:00');
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    if (editing) {
      setMovieId(editing.movieId);
      setSingleStart(editing.start);
    }
  }, [editing]);

  const movie = useMemo<Movie | null>(
    () => weekPlan.movies.find(m => m.id === movieId) ?? null,
    [movieId, weekPlan.movies]
  );

  const isPremiereThursday = useMemo(() => {
    if (!movie || movie.type !== 'PREMIERE') return false;
    return day === 4;
  }, [movie, day]);

  const movieDayCount = useMemo(
    () => movie
      ? weekPlan.screenings.filter(s => s.day === day && s.movieId === movie.id).length
      : 0,
    [weekPlan.screenings, day, movie]
  );

  const requireDualThisThursday = !editing && isPremiereThursday && movieDayCount === 0;

  const inDayRange = (hhmm: string) =>
    toMin(hhmm) >= toMin(hour_start) && toMin(hhmm) < toMin(hour_end);

  const endWithCleaning = (hhmm: string, duration: number) =>
    addMin(hhmm, duration + cleaning_min_by_room[room.size]);

  const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    const a1 = toMin(aStart), a2 = toMin(aEnd);
    const b1 = toMin(bStart), b2 = toMin(bEnd);
    return a1 < b2 && b1 < a2;
  };

  const makeProposal = (start: string, mId = movie!.id): Screening => ({
    id: editing?.id ?? '__proposal__',
    movieId: mId,
    roomId: room.id,
    day,
    start
  });

  const planWithoutEditing = useMemo<WeekPlan>(() => {
    if (!editing) return weekPlan;
    return { ...weekPlan, screenings: weekPlan.screenings.filter(s => s.id !== editing.id) };
  }, [weekPlan, editing]);

  useEffect(() => {
    if (!movie) { 
      setErrors([]); 
      setWarnings([]); 
      return; 
    }

    const baseErrors: string[] = [];
    const baseWarnings: string[] = [];

    if (movie.durationMin > 150 && room.size === 'SMALL') {
      baseErrors.push('Las películas de más de 150 min no pueden programarse en sala chica.');
    }

    if (!requireDualThisThursday) {
      if (!/^\d{2}:\d{2}$/.test(singleStart)) 
        baseErrors.push('Formato de hora inválido. Usa HH:mm.');
      if (!inDayRange(singleStart)) 
        baseErrors.push(`La hora debe estar entre ${hour_start} y 23:59.`);

      if (baseErrors.length === 0) {
        const results = runAllRules({
          weekPlan: planWithoutEditing,
          proposal: makeProposal(singleStart),
          movie,
          room,
        });
        const uniq = dedupeAlerts(results);
        baseErrors.push(...uniq.filter(r => r.level === 'ERROR').map(r => r.message));
        baseWarnings.push(...uniq.filter(r => r.level === 'WARN').map(r => r.message));
      }

      setErrors(baseErrors);
      setWarnings(baseWarnings);
      return;
    }

    const fmtErrs: string[] = [];
    if (!/^\d{2}:\d{2}$/.test(startA) || !/^\d{2}:\d{2}$/.test(startB)) {
      fmtErrs.push('Formato de hora inválido. Usa HH:mm.');
    }
    if (!inDayRange(startA) || !inDayRange(startB)) {
      fmtErrs.push(`Las horas deben estar entre ${hour_start} y 23:59.`);
    }

    const endA = endWithCleaning(startA, movie.durationMin);
    const endB = endWithCleaning(startB, movie.durationMin);
    
    if (overlaps(startA, endA, startB, endB)) {
      fmtErrs.push('Los dos horarios propuestos se empalman entre sí (considerando limpieza).');
    }

    if (baseErrors.length + fmtErrs.length > 0) {
      setErrors([...baseErrors, ...fmtErrs]);
      setWarnings(baseWarnings);
      return;
    }

    const resA = runAllRules({
      weekPlan: planWithoutEditing,
      proposal: makeProposal(startA),
      movie,
      room,
      virtualAdds: [ makeProposal(startB) ],
    });

    const resB = runAllRules({
      weekPlan: planWithoutEditing,
      proposal: makeProposal(startB),
      movie,
      room,
      virtualAdds: [ makeProposal(startA) ],
    });

    const all = dedupeAlerts([...resA, ...resB]);
    baseErrors.push(...all.filter(r => r.level === 'ERROR').map(r => r.message));
    baseWarnings.push(...all.filter(r => r.level === 'WARN').map(r => r.message));

    setErrors(baseErrors);
    setWarnings(baseWarnings);
  }, [
    movie, day, room, weekPlan.screenings,
    singleStart, startA, startB,
    requireDualThisThursday, planWithoutEditing, editing
  ]);

  function onAddSingle() {
    if (!movie || errors.length > 0) return;
    const s: Screening = { id: newId(), movieId: movie.id, roomId: room.id, day, start: singleStart };
    setWeekPlan(prev => ({ ...prev, screenings: [...prev.screenings, s] }));
    setSingleStart('10:00');
    setMovieId('');
  }

  function onAddDual() {
    if (!movie || errors.length > 0) return;
    const a: Screening = { id: newId(), movieId: movie.id, roomId: room.id, day, start: startA };
    const b: Screening = { id: newId(), movieId: movie.id, roomId: room.id, day, start: startB };
    setWeekPlan(prev => ({ ...prev, screenings: [...prev.screenings, a, b] }));
    setStartA('10:00'); setStartB('13:00'); setMovieId('');
  }

  function onUpdate() {
    if (!movie || !editing || errors.length > 0) return;
    const updated: Screening = { ...editing, movieId: movie.id, start: singleStart, day, roomId: room.id };
    setWeekPlan(prev => ({
      ...prev,
      screenings: prev.screenings.map(s => s.id === editing.id ? updated : s)
    }));
    setEditing(null);
    setMovieId('');
    setSingleStart('10:00');
  }

  function newId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `sc_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
  }

  function onCancelEdit() {
    setEditing(null);
    setMovieId('');
    setSingleStart('10:00');
  }

  function dedupeAlerts(arr: ValidationResult[]): ValidationResult[] {
    const seen = new Set<string>();
    return arr.filter(a => {
      const key = `${a.ruleId}|${a.level}|${a.message}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }

  const isEditing = !!editing;

  return (
    <div className="planner__root">
      <div className={`planner__row ${requireDualThisThursday ? 'planner__row--dual' : ''}`}>
        <MoviePicker movies={weekPlan.movies} value={movieId} onChange={setMovieId} />

        {!requireDualThisThursday ? (
          <>
            <TimePicker value={singleStart} onChange={setSingleStart} />
            {!isEditing ? (
              <button type="button" className="btn planner__btn" onClick={onAddSingle} disabled={!movie || errors.length > 0}>
                Agregar
              </button>
            ) : (
              <>
                <button type="button" className="btn planner__btn" onClick={onUpdate} disabled={!movie || errors.length > 0}>
                  Actualizar
                </button>
                <button type="button" className="btn planner__btn" onClick={onCancelEdit}>
                  Cancelar
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <TimePicker value={startA} onChange={setStartA} />
            <TimePicker value={startB} onChange={setStartB} />
            <button type="button" className="btn planner__btn" onClick={onAddDual} disabled={!movie || errors.length > 0}>
              Agregar 2
            </button>
          </>
        )}
      </div>

      {(movie && isPremiereThursday && !isEditing && movieDayCount < 2) && (
        <small className="planner__help">
          Jueves (PREMIERE): necesitas 2 funciones de <strong>{movie.title}</strong> en el día.&nbsp;
          {movieDayCount === 0 ? 'Agrega 2 ahora.' : 'Ya hay 1, agrega 1 más.'}
        </small>
      )}

      {(errors.length > 0 || warnings.length > 0) && (
        <div className="planner__alerts">
          <ValidationAlerts items={[
            ...errors.map((message, i) => ({ ruleId:`err.${i}`, level:'ERROR' as const, message })),
            ...warnings.map((message, i) => ({ ruleId:`warn.${i}`, level:'WARN' as const, message })),
          ]} />
        </div>
      )}
    </div>
  );
}