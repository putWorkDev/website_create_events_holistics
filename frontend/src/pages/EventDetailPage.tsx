import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventsApi, extractErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { buildGoogleCalendarUrl } from '../utils/googleCalendar';
import { formatDate, formatPrice, formatTime } from '../utils/format';
import type { EventItem } from '../types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1400&q=60';

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rsvpMessage, setRsvpMessage] = useState<string | null>(null);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    eventsApi
      .getBySlug(slug)
      .then((data) => {
        setEvent(data);
        setError(null);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleRsvp = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    setRsvpError(null);
    setRsvpMessage(null);
    try {
      const result = await eventsApi.rsvp(event.slug, name, email);
      setRsvpMessage(result.message);
      const refreshed = await eventsApi.getBySlug(event.slug);
      setEvent(refreshed);
    } catch (err) {
      setRsvpError(extractErrorMessage(err, 'Could not complete your RSVP'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl px-4 py-20 text-center text-forest-700">Loading…</div>;
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-forest-900/70">{error ?? 'Event not found.'}</p>
        <Link to="/events" className="btn-primary mt-6">
          Back to events
        </Link>
      </div>
    );
  }

  const isFull = event.spotsLeft !== null && event.spotsLeft !== undefined && event.spotsLeft <= 0;

  return (
    <div>
      <div className="relative h-72 w-full overflow-hidden md:h-96">
        <img
          src={event.imageUrl || FALLBACK_IMAGE}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-6xl px-4 pb-8 text-white">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold shadow"
            style={{ backgroundColor: event.category.color }}
          >
            {event.category.name}
          </span>
          <h1 className="mt-3 font-serif text-4xl font-bold md:text-5xl">{event.title}</h1>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-3">
        <article className="lg:col-span-2">
          <div className="flex flex-wrap gap-6 text-sm text-forest-900/80">
            <span>📅 {formatDate(event.startTime)}</span>
            <span>🕒 {formatTime(event.startTime)} – {formatTime(event.endTime)}</span>
            <span>📍 {event.location}</span>
            <span>💶 {formatPrice(event.price)}</span>
          </div>

          <h2 className="mt-8 font-serif text-2xl font-bold text-forest-900">About this event</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-forest-900/80">
            {event.description}
          </p>

          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-8"
          >
            📆 Add to Google Calendar
          </a>
        </article>

        <aside>
          <div className="card sticky top-24 p-6">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-bold text-forest-700">
                {formatPrice(event.price)}
              </span>
              {event.spotsLeft !== null && event.spotsLeft !== undefined && (
                <span className="text-sm text-forest-900/60">
                  {isFull ? 'Fully booked' : `${event.spotsLeft} spots left`}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-forest-900/60">
              {event.attendeeCount} {event.attendeeCount === 1 ? 'person is' : 'people are'} going
            </p>

            {rsvpMessage ? (
              <div className="mt-6 rounded-xl bg-forest-50 p-4 text-center text-forest-700">
                <p className="text-2xl">🎉</p>
                <p className="mt-1 font-medium">{rsvpMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleRsvp} className="mt-6 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-forest-900/80">Name</label>
                  <input
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-forest-900/80">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {rsvpError && <p className="text-sm text-red-600">{rsvpError}</p>}
                <button type="submit" className="btn-primary w-full" disabled={submitting || isFull}>
                  {isFull ? 'Fully booked' : submitting ? 'Reserving…' : 'RSVP — count me in'}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
