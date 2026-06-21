import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  adminCategoriesApi,
  adminEventsApi,
  extractErrorMessage,
} from '../../api/client';
import { toDatetimeLocal } from '../../utils/format';
import type { Category, EventFormValues } from '../../types';

const EMPTY: EventFormValues = {
  title: '',
  summary: '',
  description: '',
  location: '',
  imageUrl: '',
  startTime: '',
  endTime: '',
  capacity: 0,
  price: 0,
  published: true,
  categoryId: 0,
};

export default function EventFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [values, setValues] = useState<EventFormValues>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminCategoriesApi.list().then(setCategories).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    adminEventsApi
      .get(Number(id))
      .then((event) => {
        setValues({
          title: event.title,
          summary: event.summary ?? '',
          description: event.description,
          location: event.location,
          imageUrl: event.imageUrl ?? '',
          startTime: toDatetimeLocal(event.startTime),
          endTime: toDatetimeLocal(event.endTime),
          capacity: event.capacity,
          price: event.price,
          published: event.published,
          categoryId: event.category.id,
        });
      })
      .catch((err) => setError(extractErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = <K extends keyof EventFormValues>(key: K, value: EventFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const canSubmit = useMemo(
    () =>
      values.title.trim() &&
      values.description.trim() &&
      values.location.trim() &&
      values.startTime &&
      values.endTime &&
      values.categoryId > 0,
    [values],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const payload: EventFormValues = {
      ...values,
      startTime: new Date(values.startTime).toISOString(),
      endTime: new Date(values.endTime).toISOString(),
      capacity: Number(values.capacity) || 0,
      price: Number(values.price) || 0,
    };
    try {
      if (isEdit && id) {
        await adminEventsApi.update(Number(id), payload);
      } else {
        await adminEventsApi.create(payload);
      }
      navigate('/admin/events');
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not save the event'));
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-forest-700">Loading…</p>;
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-forest-900">
        {isEdit ? 'Edit event' : 'Create event'}
      </h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-forest-900/80">Title *</label>
          <input
            className="input-field"
            value={values.title}
            onChange={(e) => update('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest-900/80">
            Short summary
          </label>
          <input
            className="input-field"
            value={values.summary}
            onChange={(e) => update('summary', e.target.value)}
            placeholder="One sentence shown on event cards"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest-900/80">Description *</label>
          <textarea
            className="input-field min-h-[140px]"
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            required
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Location *</label>
            <input
              className="input-field"
              value={values.location}
              onChange={(e) => update('location', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Category *</label>
            <select
              className="input-field"
              value={values.categoryId}
              onChange={(e) => update('categoryId', Number(e.target.value))}
              required
            >
              <option value={0} disabled>
                Select a category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Start *</label>
            <input
              type="datetime-local"
              className="input-field"
              value={values.startTime}
              onChange={(e) => update('startTime', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">End *</label>
            <input
              type="datetime-local"
              className="input-field"
              value={values.endTime}
              onChange={(e) => update('endTime', e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">
              Capacity (0 = unlimited)
            </label>
            <input
              type="number"
              min={0}
              className="input-field"
              value={values.capacity}
              onChange={(e) => update('capacity', Number(e.target.value))}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Price (€)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="input-field"
              value={values.price}
              onChange={(e) => update('price', Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-forest-900/80">Image URL</label>
          <input
            className="input-field"
            value={values.imageUrl}
            onChange={(e) => update('imageUrl', e.target.value)}
            placeholder="https://…"
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => update('published', e.target.checked)}
            className="h-4 w-4 rounded border-sand-300 text-forest-600 focus:ring-forest-400"
          />
          <span className="text-sm text-forest-900/80">Published (visible to the public)</span>
        </label>

        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={!canSubmit || submitting}>
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create event'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/admin/events')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
