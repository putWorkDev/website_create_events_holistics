import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition hover:text-forest-700 ${
    isActive ? 'text-forest-700' : 'text-forest-900/70'
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-600 text-white">
            🌿
          </span>
          <span className="font-serif text-xl font-bold text-forest-800">Holistics Events</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>
          <a href="/#about" className="text-sm font-medium text-forest-900/70 transition hover:text-forest-700">
            About
          </a>
          <a href="/#contact" className="text-sm font-medium text-forest-900/70 transition hover:text-forest-700">
            Contact
          </a>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAdmin && (
            <Link to="/admin" className="text-sm font-semibold text-forest-700 hover:underline">
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-forest-900/70">Hi, {user?.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="btn-secondary px-4 py-2 text-sm">
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-forest-900/70 hover:text-forest-700">
                Log in
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2 text-sm">
                Join us
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-forest-800 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </nav>

      {open && (
        <div className="space-y-2 border-t border-sand-200 px-4 py-4 md:hidden">
          <Link to="/" onClick={() => setOpen(false)} className="block py-1 text-forest-900/80">
            Home
          </Link>
          <Link to="/events" onClick={() => setOpen(false)} className="block py-1 text-forest-900/80">
            Events
          </Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setOpen(false)} className="block py-1 text-forest-700">
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block py-1 text-forest-700">
              Log out
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary px-4 py-2 text-sm">
                Log in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary px-4 py-2 text-sm">
                Join us
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
