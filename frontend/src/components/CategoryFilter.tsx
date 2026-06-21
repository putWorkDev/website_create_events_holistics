import type { Category } from '../types';

interface Props {
  categories: Category[];
  selected: number | null;
  onSelect: (categoryId: number | null) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
          selected === null
            ? 'border-forest-600 bg-forest-600 text-white'
            : 'border-sand-300 bg-white text-forest-900/70 hover:border-forest-400'
        }`}
      >
        All
      </button>
      {categories.map((category) => {
        const active = selected === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-transparent text-white'
                : 'border-sand-300 bg-white text-forest-900/70 hover:border-forest-400'
            }`}
            style={active ? { backgroundColor: category.color } : undefined}
          >
            {category.name}
            {typeof category.eventCount === 'number' && (
              <span className={`ml-1.5 text-xs ${active ? 'text-white/80' : 'text-forest-900/40'}`}>
                {category.eventCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
