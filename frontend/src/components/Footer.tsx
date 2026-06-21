export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-forest-900 text-sand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-bold">🌿 Holistics Events</p>
          <p className="mt-3 text-sm text-sand-200/80">
            Gatherings for a balanced life — yoga, meditation, sound healing and mindful community.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sand-200/60">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-sand-200/80">
            <li><a href="/events" className="hover:text-white">All events</a></li>
            <li><a href="/#about" className="hover:text-white">About us</a></li>
            <li><a href="/#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div id="contact">
          <p className="text-sm font-semibold uppercase tracking-wide text-sand-200/60">Get in touch</p>
          <ul className="mt-3 space-y-2 text-sm text-sand-200/80">
            <li>📧 hello@holistics.events</li>
            <li>📞 +351 900 000 000</li>
            <li>📍 Lisbon &amp; Porto, Portugal</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-sand-200/60">
        © {new Date().getFullYear()} Holistics Events. Crafted with care.
      </div>
    </footer>
  );
}
