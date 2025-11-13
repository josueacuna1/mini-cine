import type { ValidationResult } from '../../domain/rules'
import './planner.css'

export default function ValidationAlerts({ items }: { items: ValidationResult[] }) {
  if (!items.length) return null

  return (
    <ul className="planner__alertsList">
      {items.map((it) => (
        <li
          key={it.ruleId}
          className={`planner__alertItem ${
            it.level === 'ERROR' ? 'is-error' : 'is-warn'
          }`}
        >
          <strong className="planner__alertLabel">
            {it.level === 'ERROR' ? 'Error:' : 'Aviso:'}
          </strong>{' '}
          {it.message}
        </li>
      ))}
    </ul>
  )
}
