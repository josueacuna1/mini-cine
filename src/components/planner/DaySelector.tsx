import './planner.css'; 

const week = [
  { id: 1, label: 'Lun' },
  { id: 2, label: 'Mar' },
  { id: 3, label: 'Mié' },
  { id: 4, label: 'Jue' },
  { id: 5, label: 'Vie' },
  { id: 6, label: 'Sáb' },
  { id: 7, label: 'Dom' },
];

export default function DaySelector({
  day,
  onChange,
}: {
  day: number;
  onChange: (d: number) => void;
}) {
  return (
    <div className="planner__daySelector">
      {week.map((d) => (
        <button
          key={d.id}
          onClick={() => onChange(d.id)}
          className={`planner__dayBtn ${d.id === day ? 'is-active' : ''}`}
        >
          {d.label}
        </button>
      ))}
    </div>
  );
}