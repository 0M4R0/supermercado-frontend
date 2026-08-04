import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Loader2, PackageSearch } from "lucide-react";
import { ProductList } from "../components/products/ProductList";
import FilterOptions from "../components/products/FilterOptions";
import FilterSidePanel from "../components/products/FilterSidePanel";
import Breadcrumb from "../components/products/Breadcrumb";
import { fetchCategorias, fetchProductos } from "../api/productos";
import { mapProducto } from "../lib/mapProduct";
import { SORT_OPTIONS, type SortOption } from "../types/api";
import { useUI } from "../context/UIContext";
import type { Category, Product } from "../types/product";

const PAGE_SIZE = 20;

function parseCategoryIdsFromSearch(raw: string | null): number[] {
    if (!raw) return [];
    return raw
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((id) => Number.isInteger(id) && id > 0);
}

const Catalog = () => {
    const { openOverlay } = useUI();
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(() =>
        parseCategoryIdsFromSearch(searchParams.get("categoria_id"))
    );
    const [sort, setSort] = useState<SortOption>(SORT_OPTIONS[0]);

    useEffect(() => {
        setSelectedCategoryIds(parseCategoryIdsFromSearch(searchParams.get("categoria_id")));
        setPage(1);
    }, [searchParams]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategorias();
                setCategories(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocurrió un error inesperado.");
                }
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetchProductos({
                    page,
                    limit: PAGE_SIZE,
                    categoria_id: selectedCategoryIds.length ? selectedCategoryIds : undefined,
                    order: sort.order,
                    dir: sort.dir,
                });

                setProducts(response.data.map(mapProducto));
                setTotal(response.total);
                setTotalPages(response.total_pages);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error desconocido");
                }
                setProducts([]);
                setTotal(0);
                setTotalPages(1);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [page, selectedCategoryIds, sort]);

    const handleCategoryChange = (categoryId: number) => {
        setPage(1);
        setSelectedCategoryIds((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSortChange = (nextSort: SortOption) => {
        setPage(1);
        setSort(nextSort);
    };

    const handleClearFilters = () => {
        setPage(1);
        setSelectedCategoryIds([]);
        setSort(SORT_OPTIONS[0]);
    };

    return (
        <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb
                    items={[
                        { label: "Inicio", to: "/home" },
                        { label: "Catálogo" },
                    ]}
                />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
                    {loading ? (
                        <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
                            <Loader2 size={14} className="animate-spin" />
                            Cargando productos...
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 font-medium">
                            <PackageSearch size={15} />
                            {total} producto{total !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {error && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">{error}</p>
                )}

                <div className="flex flex-col gap-4 min-[770px]:flex-row min-[770px]:gap-8">
                    <button
                        type="button"
                        onClick={() => openOverlay("filters")}
                        className="flex min-[770px]:hidden items-center justify-center gap-2 w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer active:scale-[0.99]"
                    >
                        <SlidersHorizontal size={18} className="text-green-600" />
                        Filtros
                    </button>

                    <aside className="hidden min-[770px]:block sticky top-20 h-fit w-64 shrink-0 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <FilterOptions
                            categories={categories}
                            selectedCategoryIds={selectedCategoryIds}
                            onCategoryChange={handleCategoryChange}
                            onClearFilters={handleClearFilters}
                            sort={sort}
                            sortOptions={SORT_OPTIONS}
                            onSortChange={handleSortChange}
                            categoriesLoading={categoriesLoading}
                        />
                    </aside>

                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-24">
                                <Loader2 size={32} className="animate-spin text-green-600" />
                            </div>
                        ) : products.length > 0 ? (
                            <>
                                <ProductList
                                    products={products}
                                    emptyMessage="No hay productos con los filtros seleccionados."
                                />

                                {totalPages > 1 && (
                                    <div className="mt-10 flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => setPage((p) => p - 1)}
                                            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            ← Anterior
                                        </button>
                                        <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
                                            {page} de {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage((p) => p + 1)}
                                            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                        >
                                            Siguiente →
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full min-h-96 text-center bg-white border border-gray-200 rounded-2xl p-10">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <PackageSearch size={28} className="text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium">
                                    No hay productos con los filtros seleccionados.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <FilterSidePanel
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryChange={handleCategoryChange}
                onClearFilters={handleClearFilters}
                sort={sort}
                sortOptions={SORT_OPTIONS}
                onSortChange={handleSortChange}
                categoriesLoading={categoriesLoading}
            />
        </div>
    );
};

export default Catalog;
