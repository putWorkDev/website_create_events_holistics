import { useEffect, useState, type FormEvent } from 'react';
import { adminCategoriesApi, extractErrorMessage } from '../../api/client';
import type { Category, CategoryFormValues } from '../../types';

const EMPTY: CategoryFormValues = { name: '', description: '', color: '#16a34a' };

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormValues>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    adminCategoriesApi
      .list()
      .then(setCategories)
      .catch((err) => setError(extractErrorMessage(err)));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(EMPTY);
    setEditingId(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await adminCategoriesApi.update(editingId, form);
      } else {
        await adminCategoriesApi.create(form);
      }
      resetForm();
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      description: category.description ?? '',
      color: category.color,
    });
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await adminCategoriesApi.remove(category.id);
      load();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-bold text-forest-900">Categories</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card h-fit space-y-4 p-6">
          <h2 className="font-serif text-lg font-bold text-forest-900">
            {editingId ? 'Edit category' : 'New category'}
          </h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Name</label>
            <input
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Description</label>
            <textarea
              className="input-field min-h-[80px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-forest-900/80">Colour</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                className="h-10 w-14 cursor-pointer rounded border border-sand-300"
              />
              <input
                className="input-field"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1" disabled={submitting}>
              {editingId ? 'Save' : 'Add category'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-2">
          <div className="card divide-y divide-sand-100">
            {categories.length === 0 ? (
              <p className="p-8 text-center text-forest-900/50">No categories yet.</p>
            ) : (
              categories.map((category) => (
                <div key={category.id} className="flex items-center gap-4 p-4">
                  <span
                    className="h-9 w-9 shrink-0 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-forest-900">{category.name}</p>
                    <p className="truncate text-sm text-forest-900/60">
                      {category.description || '—'}
                    </p>
                  </div>
                  <span className="text-sm text-forest-900/50">{category.eventCount ?? 0} events</span>
                  <button
                    onClick={() => handleEdit(category)}
                    className="font-medium text-forest-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
