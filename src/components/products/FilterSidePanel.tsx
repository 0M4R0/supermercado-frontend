import { useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { useUI } from "../../context/UIContext";
import FilterOptions from "./FilterOptions";
import type { Category } from "../../types/product";
import type { SortOption } from "../../types/api";

type FilterSidePanelProps = {
  categories: Category[];
  selectedCategoryIds: number[];
  onCategoryChange: (categoryId: number) => void;
  sort: SortOption;
  sortOptions: SortOption[];
  onSortChange: (sort: SortOption) => void;
  categoriesLoading?: boolean;
};

const FilterSidePanel = ({
  categories,
  selectedCategoryIds,
  onCategoryChange,
  sort,
  sortOptions,
  onSortChange,
  categoriesLoading = false,
}: FilterSidePanelProps) => {
  const { activeOverlay, closeOverlay } = useUI();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeOverlay === "filters") {
        closeOverlay();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [activeOverlay, closeOverlay]);

  if (activeOverlay !== "filters") return null;

  const isOpen = activeOverlay === "filters";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={closeOverlay}
      />

      <div
        className={`fixed top-0 left-0 z-50 h-full w-2/3 max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={22} className="text-green-600" />
            <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
          </div>
          <button
            onClick={closeOverlay}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition text-gray-500"
            aria-label="Cerrar filtros"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <FilterOptions
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            onCategoryChange={onCategoryChange}
            sort={sort}
            sortOptions={sortOptions}
            onSortChange={onSortChange}
            categoriesLoading={categoriesLoading}
          />
        </div>

        <div className="border-t border-gray-200 p-4">
<button
                        onClick={closeOverlay}
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-green-600/25 hover:bg-green-700 transition active:scale-[0.99] cursor-pointer"
                    >
                        Ver resultados
                    </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidePanel;
