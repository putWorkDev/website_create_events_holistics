import { NavLink } from 'react-router-dom';

const items = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/events', label: 'Events', icon: '📅', end: false },
  { to: '/admin/categories', label: 'Categories', icon: '🏷️', end: false },
  { to: '/admin/users', label: 'Users', icon: '👥', end: false },
];

export default function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 md:w-60">
      <div className="card sticky top-24 p-4">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-forest-900/40">
          Administration
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-forest-600 text-white'
                    : 'text-forest-900/70 hover:bg-forest-50'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
