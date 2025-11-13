import type { Dispatch, SetStateAction } from 'react';
import type { WeekPlan } from '../domain/types';
import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import CatalogView from '../views/CatalogView';
import PlannerView from '../views/PlannerView';
import DashboardView from '../views/DashboardView';

import '../components/planner/planner.css';
import '../components/dashboard/dashboard.css';
import '../components/catalog/catalog.css';

import '../styles/index.css';
import '../styles/transitions.css';

type Props = {
  weekPlan: WeekPlan;
  setWeekPlan: Dispatch<SetStateAction<WeekPlan>>;
};

export default function App({ weekPlan, setWeekPlan }: Props) {
  const [tab, setTab] = useState<'catalog' | 'planner' | 'dashboard'>('catalog');

  return (
    <div className="app-shell">
      <Navbar tab={tab} onChange={setTab} />

      <main className="view-switch">
        {tab === 'catalog' && <CatalogView weekPlan={weekPlan} />}
        {tab === 'planner' && <PlannerView weekPlan={weekPlan} setWeekPlan={setWeekPlan} />}
        {tab === 'dashboard' && <DashboardView weekPlan={weekPlan} />}
      </main>
    </div>
  );
}