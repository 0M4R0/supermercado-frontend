import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import FilterOptions from "../components/FilterOptions";
import Breadcrumb from "../components/Breadcrumb";
import { fetchCategorias, fetchProductos } from "../api/productos";
import { mapProducto } from "../lib/mapProduct";
import { SORT_OPTIONS, type SortOption } from "../types/api";
import type { Category, Product } from "../types/product";

const PAGE_SIZE = 20;

const Catalog = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [sort, setSort] = useState<SortOption>(SORT_OPTIONS[0]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategorias();
                setCategories(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
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

    return (
        <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb
                    items={[
                        { label: "Inicio", to: "/home" },
                        { label: "Catálogo" },
                    ]}
                />

                <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
                <p className="mt-1 text-sm text-gray-500 mb-6">
                    {loading
                        ? "Cargando productos..."
                        : `${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
                </p>

                {error && (
                    <p className="mb-4 text-sm text-red-600">{error}</p>
                )}

                <div className="flex gap-8">
                    <aside className="w-64 shrink-0 border border-gray-200 rounded-lg p-6">
                        <FilterOptions
                            categories={categories}
                            selectedCategoryIds={selectedCategoryIds}
                            onCategoryChange={handleCategoryChange}
                            sort={sort}
                            sortOptions={SORT_OPTIONS}
                            onSortChange={handleSortChange}
                            categoriesLoading={categoriesLoading}
                        />
                    </aside>

                    <div className="flex-1">
                        {loading ? (
                            <p className="text-gray-500">Cargando...</p>
                        ) : products.length > 0 ? (
                            <>
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-4">
                                        <button
                                            type="button"
                                            disabled={page <= 1}
                                            onClick={() => setPage((p) => p - 1)}
                                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Anterior
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            Página {page} de {totalPages}
                                        </span>
                                        <button
                                            type="button"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage((p) => p + 1)}
                                            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="text-gray-500">
                                    No hay productos con los filtros seleccionados.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
