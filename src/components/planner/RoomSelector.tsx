import type { Room } from '../../domain/types'
import './planner.css'

type Props = {
  rooms: Room[]
  value: string
  onChange: (roomId: string) => void
}

export default function RoomSelector({ rooms, value, onChange }: Props) {
  return (
    <div className="planner__roomSelector">
      <select
        className="planner__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {rooms.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name} ({r.size}{r.seats ? ` · ${r.seats}` : ''})
          </option>
        ))}
      </select>
    </div>
  )
}
