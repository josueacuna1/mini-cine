import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ReferenceLine
} from "recharts";

const day_labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export type DayRow = {
  day: number;
  usagePct: number;
  occupiedMin: number;
  idleMin: number;
  screeningsCount: number;
  capacityEst: number;
};

export type MetricKey = "usagePct" | "occupiedMin" | "idleMin" | "screeningsCount" | "capacityEst";

const metrics: Record<MetricKey, {
  label: string;
  unit: "%" | "min" | "";
  color: string;
  tickFmt: (v:number)=>string;
  yDomain: (values:number[]) => [number, number];
}> = {
  usagePct: {
    label: "% Uso",
    unit: "%",
    color: "var(--teal-500)",
    tickFmt: (v) => `${v}%`,
    yDomain: () => [0, 100]
  },
  occupiedMin: {
    label: "Ocupado (min)",
    unit: "min",
    color: "var(--amber-500)",
    tickFmt: (v) => `${v}m`,
    yDomain: (vals) => {
      const max = Math.max(1, ...vals);
      const step = 60;
      const top = Math.ceil(max / step) * step;
      return [0, top];
    }
  },
  idleMin: {
    label: "Libre (min)",
    unit: "min",
    color: "var(--teal-500)",
    tickFmt: (v) => `${v}m`,
    yDomain: (vals) => {
      const max = Math.max(1, ...vals);
      const step = 60;
      const top = Math.ceil(max / step) * step;
      return [0, top];
    }
  },
  screeningsCount: {
    label: "Funciones",
    unit: "",
    color: "var(--amber-500)",
    tickFmt: (v) => `${v}`,
    yDomain: (vals) => {
      const max = Math.max(1, ...vals);
      const top = Math.max(5, Math.ceil(max / 5) * 5);
      return [0, top];
    }
  },
  capacityEst: {
    label: "Capacidad estimada",
    unit: "",
    color: "var(--teal-500)",
    tickFmt: (v) => new Intl.NumberFormat("es-MX", { notation: "compact" }).format(v),
    yDomain: (vals) => {
      const max = Math.max(1, ...vals);
      const step = Math.pow(10, String(Math.floor(Math.log10(max)) || 0).length - 1);
      const top = Math.ceil(max / step) * step;
      return [0, top];
    }
  }
};

export default function WeeklyMetricLineChart({
  data, metric
}: { data: DayRow[]; metric: MetricKey }) {
  const meta = metrics[metric];

  const chartData = [...data]
    .sort((a,b)=>a.day-b.day)
    .map(d => ({
      name: day_labels[d.day-1],
      value: metric === "usagePct" ? Number(d.usagePct.toFixed(1)) : (d as any)[metric]
    }));

  const values = chartData.map(d => d.value as number);
  const domain = meta.yDomain(values);

  return (
    <div className="db-weekChart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 6 }}>
          <CartesianGrid stroke="var(--divider)" strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--text-2)", fontSize: 12 }}
            axisLine={{ stroke: "var(--divider)" }}
            tickLine={{ stroke: "var(--divider)" }}
          />
          <YAxis
            domain={domain}
            tick={{ fill: "var(--text-2)", fontSize: 12 }}
            axisLine={{ stroke: "var(--divider)" }}
            tickLine={{ stroke: "var(--divider)" }}
            tickFormatter={meta.tickFmt}
          />
          <Tooltip
            contentStyle={{ background: "var(--card)", border: "1px solid var(--divider)", borderRadius: 10, color: "var(--text)" }}
            labelStyle={{ color: "var(--text-muted)" }}
            formatter={(v) => [`${meta.tickFmt(Number(v))}`, meta.label]}
          />
          <Legend wrapperStyle={{ color: "var(--text-2)" }} />
          {metric === "usagePct" && (
            <ReferenceLine y={70} stroke="var(--amber-500)" strokeDasharray="4 4" />
          )}
          <Line
            type="monotone"
            dataKey="value"
            name={meta.label}
            stroke={meta.color}
            strokeWidth={2.5}
            dot={{ r: 4, fill: "var(--amber-500)", stroke: "var(--card)", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}