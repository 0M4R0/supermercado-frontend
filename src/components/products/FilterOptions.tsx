import type { Category } from "../../types/product";
import type { SortOption } from "../../types/api";

type FilterOptionsProps = {
  categories: Category[];
  selectedCategoryIds: number[];
  onCategoryChange: (categoryId: number) => void;
  onClearFilters: () => void;
  sort: SortOption;
  sortOptions: SortOption[];
  onSortChange: (sort: SortOption) => void;
  categoriesLoading?: boolean;
};

const FilterOptions = ({
  categories,
  selectedCategoryIds,
  onCategoryChange,
  onClearFilters,
  sort,
  sortOptions,
  onSortChange,
  categoriesLoading = false,
}: FilterOptionsProps) => {
  const sortKey = `${sort.order}-${sort.dir}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-row justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filtros</h2>

        <button
          className="inline-flex items-center text-xs font-medium text-green-600 border border-green-200 bg-green-50 rounded-full px-3 py-1 hover:bg-green-100 hover:border-green-300 transition cursor-pointer"
          onClick={onClearFilters}
        >
          Limpiar
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Categorías
        </h3>
        {categoriesLoading ? (
          <p className="text-sm text-gray-500">Cargando categorías...</p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No hay categorías disponibles.
          </p>
        ) : (
          <ul className="space-y-1">
            {categories.map((category) => {
              const isChecked = selectedCategoryIds.includes(category.id);

              return (
                <li key={category.id}>
                  <label className="flex items-center gap-2.5 cursor-pointer text-sm text-gray-700 hover:text-gray-900 px-2 py-1.5 -mx-2 rounded-lg hover:bg-gray-50 transition">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onCategoryChange(category.id)}
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    {category.nombre}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Ordenar por
        </h3>
        <ul className="space-y-1">
          {sortOptions.map((option) => {
            const optionKey = `${option.order}-${option.dir}`;
            const isSelected = sortKey === optionKey;

            return (
              <li key={optionKey}>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900 px-2 py-1.5 -mx-2 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="sort"
                    checked={isSelected}
                    onChange={() => onSortChange(option)}
                    className="h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  {option.label}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FilterOptions;
