import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminDashboardApi, extractErrorMessage } from '../../api/client';
import type { DashboardStats } from '../../types';

const CARDS: { key: keyof DashboardStats; label: string; icon: string; accent: string }[] = [
  { key: 'totalEvents', label: 'Total events', icon: '📅', accent: 'bg-forest-50 text-forest-700' },
  { key: 'upcomingEvents', label: 'Upcoming events', icon: '⏳', accent: 'bg-sand-100 text-sand-600' },
  { key: 'publishedEvents', label: 'Published', icon: '✅', accent: 'bg-forest-50 text-forest-700' },
  { key: 'totalCategories', label: 'Categories', icon: '🏷️', accent: 'bg-sand-100 text-sand-600' },
  { key: 'totalAttendees', label: 'RSVPs', icon: '🎟️', accent: 'bg-forest-50 text-forest-700' },
  { key: 'totalUsers', label: 'Members', icon: '👥', accent: 'bg-sand-100 text-sand-600' },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminDashboardApi
      .stats()
      .then(setStats)
      .catch((err) => setError(extractErrorMessage(err)));
  }, []);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-forest-900">Dashboard</h1>
          <p className="text-sm text-forest-900/60">An overview of your community at a glance.</p>
        </div>
        <Link to="/admin/events/new" className="btn-primary text-sm">
          + New event
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <div key={card.key} className="card p-6">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.accent}`}>
              {card.icon}
            </div>
            <p className="text-3xl font-bold text-forest-900">
              {stats ? stats[card.key] : '—'}
            </p>
            <p className="text-sm text-forest-900/60">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Link to="/admin/events" className="card p-6 transition hover:shadow-md">
          <p className="text-2xl">📅</p>
          <h3 className="mt-2 font-serif text-lg font-bold text-forest-900">Manage events</h3>
          <p className="text-sm text-forest-900/60">Create, edit and publish gatherings.</p>
        </Link>
        <Link to="/admin/categories" className="card p-6 transition hover:shadow-md">
          <p className="text-2xl">🏷️</p>
          <h3 className="mt-2 font-serif text-lg font-bold text-forest-900">Manage categories</h3>
          <p className="text-sm text-forest-900/60">Organise events into themes.</p>
        </Link>
        <Link to="/admin/users" className="card p-6 transition hover:shadow-md">
          <p className="text-2xl">👥</p>
          <h3 className="mt-2 font-serif text-lg font-bold text-forest-900">Manage users</h3>
          <p className="text-sm text-forest-900/60">Assign roles and review members.</p>
        </Link>
      </div>
    </div>
  );
}
