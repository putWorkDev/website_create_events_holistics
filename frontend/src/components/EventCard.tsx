import { Link } from 'react-router-dom';
import type { EventItem } from '../types';
import { formatDateTime, formatPrice } from '../utils/format';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=60';

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      to={`/events/${event.slug}`}
      className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={event.imageUrl || FALLBACK_IMAGE}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white shadow"
          style={{ backgroundColor: event.category.color }}
        >
          {event.category.name}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-forest-600">
          {formatDateTime(event.startTime)}
        </p>
        <h3 className="font-serif text-xl font-bold text-forest-900">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-forest-900/70">
          {event.summary || event.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="flex items-center gap-1 text-forest-900/70">📍 {event.location}</span>
          <span className="font-semibold text-forest-700">{formatPrice(event.price)}</span>
        </div>
      </div>
    </Link>
  );
}
