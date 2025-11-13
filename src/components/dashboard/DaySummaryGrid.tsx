import type { WeekPlan } from '../../domain/types'
import type { MetricKey, DayRow } from './WeeklyMetricLineChart'
import { useState } from 'react'
import { useScheduleMetrics } from '../../hooks/useScheduleMetrics'
import RoomSummaryCard from './RoomSummaryCard'
import WeeklyMetricLineChart from './WeeklyMetricLineChart'
import './dashboard.css'

const day_labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export default function DaySummaryGrid({ weekPlan }: { weekPlan: WeekPlan }) {
  const { details, days, week } = useScheduleMetrics(weekPlan)
  const [metric, setMetric] = useState <MetricKey>('usagePct')

  const lineDays: DayRow[] = days.map(d => ({
    day: d.day,
    usagePct: d.usagePct,
    occupiedMin: d.occupiedMin,
    idleMin: d.idleMin,
    screeningsCount: d.screeningsCount,
    capacityEst: d.capacityEst,
  }))

  return (
    <div className="dashboard">
      <section className="db-card">
        <h3 className="db-card__title" style={{ marginBottom: 8 }}>Resumen semanal</h3>

        <div className="db-week">
          <div><strong>% Uso:</strong> {week.usagePct.toFixed(1)}%</div>
          <div><strong>Ocupado:</strong> {week.occupiedMin} min</div>
          <div><strong>Libre:</strong> {week.idleMin} min</div>
          <div><strong>Funciones:</strong> {week.screeningsCount}</div>
          <div><strong>Capacidad estimada:</strong> {week.capacityEst}</div>
        </div>

        <div className="db-metricTabs" role="tablist" aria-label="Métrica del gráfico">
          {[
            { id: 'usagePct', label: '% Uso' },
            { id: 'occupiedMin', label: 'Ocupado' },
            { id: 'idleMin', label: 'Libre' },
            { id: 'screeningsCount', label: 'Funciones' },
            { id: 'capacityEst', label: 'Capacidad' },
          ].map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={metric === t.id}
              className={`db-tab ${metric === (t.id as MetricKey) ? 'active' : ''}`}
              onClick={() => setMetric(t.id as MetricKey)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <WeeklyMetricLineChart data={lineDays} metric={metric} />
      </section>

      <div className="db-days">
        {Array.from({ length: 7 }, (_, i) => i + 1).map(day => {
          const dayDetails = details.filter(d => d.day === day)
          const dTotal = days.find(x => x.day === day)!
          return (
            <section key={day} className="db-card db-dayCard">
              <header className="db-card__header">
                <h3 className="db-card__title">{day_labels[day - 1]}</h3>
                <small className="db-card__meta">
                  Uso: <strong>{dTotal.usagePct.toFixed(1)}%</strong> - Ocupado: <strong>{dTotal.occupiedMin}m</strong> - Libre: <strong>{dTotal.idleMin}m</strong> - Funciones: <strong>{dTotal.screeningsCount}</strong> - Capacidad: <strong>{dTotal.capacityEst}</strong>
                </small>
              </header>

              <div className="db-dayCard__grid">
                {dayDetails.map(m => (
                  <RoomSummaryCard key={`${m.day}-${m.roomId}`} m={m} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}