import type { WeekPlan } from '../domain/types';
import DaySummaryGrid from '../components/dashboard/DaySummaryGrid';

export default function DashboardView({ weekPlan }: { weekPlan: WeekPlan }) {
  return (
    <section className="view-animate">
      <h2>Dashboard</h2>
      <DaySummaryGrid weekPlan={weekPlan} />
    </section>
  );
}