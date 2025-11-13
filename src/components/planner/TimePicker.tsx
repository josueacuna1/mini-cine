import type { ChangeEvent } from 'react'
import { hour_start, hour_end } from '../../utils/timeUtils'
import './planner.css'

type Props = {
  value: string
  onChange: (hhmm: string) => void
}

export default function TimePicker({ value, onChange }: Props) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)

  return (
    <div className="planner__timePicker">
      <input
        type="time"
        value={value}
        onChange={handle}
        className="planner__timeInput"
        min={hour_start}
        max={hour_end}
      />
      <small className="planner__timeHint">
        Rango válido {hour_start} am – 23:59 pm
      </small>
    </div>
  )
}
