import { ProductCard } from "./ProductCard";
import type { Product } from "../../types/product";

type ProductListProps = {
    products: Product[];
    loading?: boolean;
    emptyMessage?: string;
    gridClassName?: string;
};

export const ProductList = ({
    products,
    loading = false,
    emptyMessage = "No hay productos disponibles.",
    gridClassName = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}: ProductListProps) => {
    if (loading) {
        return <p className="text-gray-500">Cargando...</p>;
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-500">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={gridClassName}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};
