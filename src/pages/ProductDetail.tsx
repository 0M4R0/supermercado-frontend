import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { fetchProductoById } from "../api/productos";
import { mapProducto } from "../lib/mapProduct";
import { ApiError } from "../lib/api";
import { useCart } from "../context/CartContext";
import { UseAuth } from "../context/AuthContext";
import type { Product } from "../types/product";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { session } = UseAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartError, setCartError] = useState("");
    const [adding, setAdding] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (!id) return;

        const loadProduct = async () => {
            setLoading(true);
            setError("");

            try {
                const data = await fetchProductoById(id);
                setProduct(mapProducto(data));
            } catch (err) {
                if (err instanceof ApiError && err.status === 404) {
                    setProduct(null);
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Error desconocido");
                }
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;

        setCartError("");
        setAdding(true);

        try {
            if (!session) {
                navigate("/login");
                return;
            }

            await addToCart(Number(product.id), quantity);
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                navigate("/login");
                return;
            }
            setCartError(err instanceof Error ? err.message : "No se pudo agregar al carrito");
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <p>Cargando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <Breadcrumb
                        items={[
                            { label: "Inicio", to: "/home" },
                            { label: "Catálogo", to: "/catalogo" },
                            { label: "Producto no encontrado" },
                        ]}
                    />
                    <p className="text-gray-600">El producto no existe.</p>
                    <Link to="/catalogo" className="mt-4 inline-block text-green-600 hover:underline">
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = (product.price * quantity).toFixed(2);

    return (
        <div className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <Breadcrumb
                    items={[
                        { label: "Inicio", to: "/home" },
                        { label: "Catálogo", to: "/catalogo" },
                        { label: product.name },
                    ]}
                />

                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="bg-gray-100 rounded-2xl flex items-center justify-center p-8 min-h-[400px]">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-h-80 object-contain rounded-lg"
                            />
                        ) : (
                            <div className="text-gray-400">Imagen no disponible</div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {product.category && (
                            <p className="text-sm text-gray-500">{product.category}</p>
                        )}

                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-3xl font-bold text-green-600">
                                {product.price.toFixed(2)} €
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                    {product.originalPrice.toFixed(2)} €
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-0.5 rounded-full">
                                    {product.discount}
                                </span>
                            )}
                        </div>

                        {product.inStock ? (
                            <p className="flex items-center gap-1.5 text-sm text-green-600">
                                <Check className="h-4 w-4" />
                                En stock
                            </p>
                        ) : (
                            <p className="text-sm text-red-600">Sin stock</p>
                        )}

                        {product.description && (
                            <div>
                                <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        {product.distributor && (
                            <p className="text-sm text-gray-600">
                                Distribuido por <strong>{product.distributor}</strong>
                            </p>
                        )}

                        <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="p-2 hover:bg-gray-50 text-gray-600"
                                    aria-label="Reducir cantidad"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    className="p-2 hover:bg-gray-50 text-gray-600"
                                    aria-label="Aumentar cantidad"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">
                                Subtotal: <strong>{subtotal} €</strong>
                            </p>
                        </div>

                        {cartError && (
                            <p className="text-sm text-red-600">{cartError}</p>
                        )}

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={adding || !product.inStock}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {adding ? "Agregando..." : "Agregar al carrito"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
