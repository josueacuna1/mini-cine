import type { RoomDayMetrics } from '../../hooks/useScheduleMetrics'
import './dashboard.css'

export default function RoomSummaryCard({ m }: { m: RoomDayMetrics }) {
  const totalMin = Math.max(1, m.occupiedMin + m.idleMin);
  const occPct = Math.min(100, (m.occupiedMin / totalMin) * 100);
  const idlePct = Math.max(0, 100 - occPct);

  return (
    <div className="db-card roomCard">
      <div className="roomCard__head">
        <strong className="roomCard__title">
          {m.roomName} ({m.roomSize})
        </strong>
        <span className="roomCard__pct">{m.usagePct.toFixed(0)}%</span>
      </div>

      <div className="roomCard__barStack" aria-label="Distribución de tiempo">
        <div className="roomCard__seg roomCard__seg--occ" style={{ width: `${occPct}%` }} />
        <div className="roomCard__seg roomCard__seg--idle" style={{ width: `${idlePct}%` }} />
      </div>

      <div className="roomCard__legend">
        <span className="dot dot--occ" /> Ocupado {m.occupiedMin}m
        <span className="spacer" />
        <span className="dot dot--idle" /> Libre {m.idleMin}m
      </div>

      <div className="roomCard__metrics">
        <div className="metric">
          <div className="metric__label">Uso del día</div>
          <div className="metric__bar">
            <div className="metric__fill metric__fill--usage" style={{ width: `${Math.min(100, m.usagePct)}%` }} />
          </div>
        </div>
      </div>

      <div className="roomCard__info">
        <div>
          Ocupado: <strong>{m.occupiedMin} min</strong> | Libre: <strong>{m.idleMin} min</strong>
        </div>
        <div>
          Funciones: <strong>{m.screenings.length}</strong> | Capacidad estimada: <strong>{m.capacityEst}</strong>
        </div>
      </div>

      {m.screenings.length > 0 && (
        <ul className="roomCard__list">
          {m.screenings.map(s => (
            <li key={s.id}>
              {s.start} – {s.end} | {s.movieTitle} ({s.durationMin} min)
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
