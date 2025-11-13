import type { WeekPlan } from '../domain/types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { buildInitialWeekPlan } from '../data/seed';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function Root() {
  const [weekPlan, setWeekPlan] = useLocalStorage<WeekPlan>('bd-mini-cine', buildInitialWeekPlan);
  return <App weekPlan={weekPlan} setWeekPlan={setWeekPlan} />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Root /></React.StrictMode>
);
