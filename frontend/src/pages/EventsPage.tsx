import { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import EventCard from '../components/EventCard';
import { categoriesApi, eventsApi, extractErrorMessage } from '../api/client';
import type { Category, EventItem, PagedResponse } from '../types';

const PAGE_SIZE = 9;

export default function EventsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PagedResponse<EventItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(() => undefined);
  }, []);

  // Debounce the search input.
  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput);
      setPage(0);
    }, 350);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    setLoading(true);
    eventsApi
      .list({
        categoryId: selectedCategory ?? undefined,
        search: search || undefined,
        page,
        size: PAGE_SIZE,
      })
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, page]);

  const handleCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setPage(0);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-forest-900">Our events</h1>
        <p className="mt-2 text-forest-900/70">
          Discover gatherings to nourish your body, mind and spirit.
        </p>
      </header>

      <div className="mb-8 flex flex-col gap-4">
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by title, location…"
          className="input-field max-w-md"
        />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategory}
        />
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-sand-100" />
          ))}
        </div>
      ) : data && data.content.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                className="btn-secondary px-4 py-2 text-sm"
                disabled={data.first}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                ← Previous
              </button>
              <span className="text-sm text-forest-900/70">
                Page {data.page + 1} of {data.totalPages}
              </span>
              <button
                className="btn-secondary px-4 py-2 text-sm"
                disabled={data.last}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card p-12 text-center text-forest-900/60">
          No events match your search just yet. Try a different filter. 🌿
        </div>
      )}
    </div>
  );
}
