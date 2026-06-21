import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminEventsApi, extractErrorMessage } from '../../api/client';
import { formatDateTime, formatPrice } from '../../utils/format';
import type { EventItem } from '../../types';

export default function ManageEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminEventsApi
      .list()
      .then(setEvents)
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (event: EventItem) => {
    if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await adminEventsApi.remove(event.id);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-forest-900">Events</h1>
        <Link to="/admin/events/new" className="btn-primary text-sm">
          + New event
        </Link>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-100 text-xs uppercase tracking-wide text-forest-900/60">
              <tr>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">RSVPs</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-forest-900/50">
                    Loading…
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-forest-900/50">
                    No events yet. Create your first one!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className="hover:bg-sand-50">
                    <td className="px-5 py-3 font-medium text-forest-900">{event.title}</td>
                    <td className="px-5 py-3">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: event.category.color }}
                      >
                        {event.category.name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-forest-900/70">{formatDateTime(event.startTime)}</td>
                    <td className="px-5 py-3 text-forest-900/70">{formatPrice(event.price)}</td>
                    <td className="px-5 py-3 text-forest-900/70">
                      {event.attendeeCount}
                      {event.capacity > 0 && ` / ${event.capacity}`}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.published
                            ? 'bg-forest-100 text-forest-700'
                            : 'bg-sand-200 text-sand-600'
                        }`}
                      >
                        {event.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/admin/events/${event.id}/edit`}
                        className="font-medium text-forest-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(event)}
                        className="ml-4 font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
