import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { eventsApi, extractErrorMessage } from '../api/client';
import type { EventItem } from '../types';

const VALUES = [
  {
    icon: '🧘',
    title: 'Mindful practice',
    text: 'Classes and workshops led by experienced, caring facilitators for every level.',
  },
  {
    icon: '🌱',
    title: 'Holistic wellbeing',
    text: 'Nourish body, mind and spirit through movement, breath and stillness.',
  },
  {
    icon: '🤝',
    title: 'Warm community',
    text: 'Connect with like-minded people in welcoming, judgement-free spaces.',
  },
];

export default function HomePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    eventsApi
      .list({ size: 3 })
      .then((page) => setEvents(page.content))
      .catch((err) => setError(extractErrorMessage(err)));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-700 via-forest-600 to-forest-800 text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_30%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-24 md:py-32">
          <span className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium">
            Yoga · Meditation · Sound Healing
          </span>
          <h1 className="max-w-2xl font-serif text-5xl font-bold leading-tight md:text-6xl">
            Find your balance, one gathering at a time.
          </h1>
          <p className="max-w-xl text-lg text-sand-100/90">
            Holistics Events brings together nourishing wellness experiences across Lisbon and
            Porto. Move, breathe, rest and reconnect with a community that cares.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/events" className="btn-primary bg-white text-forest-700 hover:bg-sand-100">
              Browse events
            </Link>
            <Link to="/register" className="btn-secondary border-white text-white hover:bg-white/10">
              Become a member
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto -mt-12 w-full max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <div key={value.title} className="card p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-2xl">
                {value.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-forest-900">{value.title}</h3>
              <p className="mt-2 text-sm text-forest-900/70">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming events */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">
              What's coming up
            </p>
            <h2 className="font-serif text-3xl font-bold text-forest-900">Upcoming events</h2>
          </div>
          <Link to="/events" className="hidden text-sm font-semibold text-forest-700 hover:underline md:block">
            View all →
          </Link>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        {events.length === 0 && !error && (
          <p className="text-forest-900/60">New events are being planted. Check back soon. 🌱</p>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-sand-100">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?auto=format&fit=crop&w=1000&q=60"
              alt="A calm wellness studio"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-forest-600">About us</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-forest-900">
              A sanctuary for holistic living
            </h2>
            <p className="mt-4 text-forest-900/70">
              We started Holistics Events with a simple belief: wellbeing flourishes in community.
              Our gatherings blend ancient practices with modern care, hosted by facilitators who
              lead with heart.
            </p>
            <p className="mt-3 text-forest-900/70">
              Whether you are stepping onto the mat for the first time or deepening a lifelong
              practice, there is a place for you here.
            </p>
            <Link to="/events" className="btn-primary mt-6">
              Join an event
            </Link>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section id="contact" className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="card flex flex-col items-center gap-4 bg-forest-700 p-12 text-center text-white">
          <h2 className="font-serif text-3xl font-bold">Have a question or want to host with us?</h2>
          <p className="max-w-xl text-sand-100/90">
            Reach out at <span className="font-semibold">hello@holistics.events</span> or call
            +351 900 000 000. We would love to hear from you.
          </p>
          <a href="mailto:hello@holistics.events" className="btn-primary bg-white text-forest-700 hover:bg-sand-100">
            Say hello
          </a>
        </div>
      </section>
    </div>
  );
}
