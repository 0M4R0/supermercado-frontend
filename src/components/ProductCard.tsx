import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";
import { ApiError } from "../lib/api";
import { useCart } from "../context/CartContext";
import { UseAuth } from "../context/AuthContext";
import type { Product } from "../types/product";

type ProductCardProps = {
    product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
    const navigate = useNavigate();
    const { session } = UseAuth();
    const { addToCart } = useCart();
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");

    const handleAddToCart = async (event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        setError("");
        setAdding(true);

        try {
            if (!session) {
                navigate("/login");
                return;
            }

            await addToCart(Number(product.id), 1);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                navigate("/login");
                return;
            }
            setError(err instanceof Error ? err.message : "No se pudo agregar al carrito");
        } finally {
            setAdding(false);
        }
    };

    return (
        <article className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200">
            <Link to={`/catalogo/${product.id}`} className="block">
                <div className="relative bg-gray-100 h-48 flex items-center justify-center">
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="object-cover h-full w-full"
                        />
                    ) : (
                        <div className="text-gray-400">Imagen no disponible</div>
                    )}

                    {product.discount ? (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold uppercase px-2 py-1 rounded-full">
                            {product.discount}
                        </span>
                    ) : null}
                </div>
            </Link>

            <div className="p-4 space-y-3">
                {product.category ? (
                    <p className="text-xs uppercase tracking-wide text-gray-500">{product.category}</p>
                ) : null}

                <Link to={`/catalogo/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-green-600">
                        {product.price.toFixed(2)} €
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice.toFixed(2)} €
                        </span>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-red-600">{error}</p>
                )}

                <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={adding || product.inStock === false}
                    className="mt-2 inline-flex items-center justify-center w-full rounded-full bg-green-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-green-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    {adding ? "Agregando..." : "Añadir"}
                </button>
            </div>
        </article>
    );
};
