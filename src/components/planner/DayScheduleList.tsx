import type { Dispatch, SetStateAction } from 'react';
import type { WeekPlan, Room, Screening } from '../../domain/types';
import { useState } from 'react';
import { cleaning_min_by_room } from '../../domain/constants';
import { normalizeTimeOverflow, addMin } from '../../utils/timeUtils';

type Props = {
  weekPlan: WeekPlan;
  setWeekPlan: Dispatch<SetStateAction<WeekPlan>>;
  day: number;
  room: Room;
  onEdit?: (s: Screening) => void;
  editing?: Screening | null;
};

export default function DayScheduleList({
  weekPlan,
  setWeekPlan,
  day,
  room,
  onEdit,
  editing = null,
}: Props) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const items = weekPlan.screenings
    .filter(s => s.day === day && s.roomId === room.id)
    .sort((a, b) => a.start.localeCompare(b.start));

  if (!items.length)
    return <p className="planner__empty">No hay funciones asignadas.</p>;

  const moviesById = new Map(weekPlan.movies.map(m => [m.id, m]));
  const isEditing = !!editing;

  function askDelete(id: string) {
    if (isEditing) return;
    setPendingDeleteId(id);
  }

  function confirmDelete() {
    if (!pendingDeleteId) return;
    setWeekPlan(prev => ({
      ...prev,
      screenings: prev.screenings.filter(s => s.id !== pendingDeleteId),
    }));
    setPendingDeleteId(null);
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  return (
    <div className="planner__list">
      {items.map(s => {
        const movie = moviesById.get(s.movieId);
        if (!movie) return null;

        const timeToClean = cleaning_min_by_room[room.size];
        const end = normalizeTimeOverflow(addMin(s.start, movie.durationMin + timeToClean));
        const isThisEditing = editing?.id === s.id;
        const isConfirming = pendingDeleteId === s.id;
        const markedAsEditing = isThisEditing || isConfirming;

        return (
          <div
            key={s.id}
            className={`planner__item ${markedAsEditing ? 'is-editing' : ''}`}
            aria-current={markedAsEditing ? 'true' : undefined}
          >
            <div className="planner__time">{s.start} - {end} hrs.</div>

            <div className="planner__info">
              <div className="planner__movie">{movie.title}</div>
              <div className="planner__sub">
                {movie.durationMin.toLocaleString('es-MX')} min · {movie.rating} · {movie.type} · Limpieza: {timeToClean.toLocaleString('es-MX')} min.
              </div>
            </div>

            <div className="planner__actions">
              {!isConfirming ? (
                <>
                  <button
                    className="planner__iconBtn"
                    onClick={() => onEdit?.(s)}
                    disabled={isEditing}
                    aria-disabled={isEditing}
                    title={isEditing ? 'Termina la edición actual para continuar' : 'Editar'}
                  >
                    Editar
                  </button>
                  <button
                    className="planner__iconBtn planner__iconBtn--danger"
                    onClick={() => askDelete(s.id)}
                    disabled={isEditing}
                    aria-disabled={isEditing}
                    title={isEditing ? 'Termina la edición actual para continuar' : 'Eliminar'}
                  >
                    Eliminar
                  </button>
                </>
              ) : (
                <div className="planner__confirm">
                  <span>¿Eliminar esta función?</span>
                  <button
                    className="planner__iconBtn planner__iconBtn--danger"
                    onClick={confirmDelete}
                    title="Sí, eliminar"
                  >
                    Sí
                  </button>
                  <button
                    className="planner__iconBtn"
                    onClick={cancelDelete}
                    title="No, cancelar"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
