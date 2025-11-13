import './navbar.css';
type Tab = 'catalog' | 'planner' | 'dashboard';

export default function Navbar({
  tab, onChange
}: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <header className="navbar">
      <ul className="navbar-list">
        <li>
          <button
            className={`nav-btn ${tab === 'catalog' ? 'active' : ''}`}
            onClick={() => onChange('catalog')}
          >
            Catálogo
          </button>
        </li>
        <li>
          <button
            className={`nav-btn ${tab === 'planner' ? 'active' : ''}`}
            onClick={() => onChange('planner')}
          >
            Planificador
          </button>
        </li>
        <li>
          <button
            className={`nav-btn ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onChange('dashboard')}
          >
            Dashboard
          </button>
        </li>
      </ul>
    </header>
  );
}
