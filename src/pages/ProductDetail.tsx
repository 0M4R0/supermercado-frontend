import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import Breadcrumb from "../components/products/Breadcrumb";
import { fetchProductoById } from "../api/productos";
import { mapProducto } from "../lib/mapProduct";
import { ApiError } from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types/product";
import { formatPrice } from "../utils/formatPrice";
import { useUI } from "../context/UIContext";

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { session } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartError, setCartError] = useState("");
    const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { openOverlay } = useUI();

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

        const maxAllowed = product.maxStock ?? product.stock ?? 0;
        if (quantity > maxAllowed) {
            setCartError(`Máximo ${maxAllowed} unidades por cliente`);
            return;
        }

        setCartError("");
        setAdding(true);

        try {
            if (!session) {
                navigate("/login");
                return;
            }

            // ADD TO CART
            await addToCart(Number(product.id), quantity);

            // OPEN CART OVERLAY
            openOverlay('cart');
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
                    <div className="flex justify-center py-24">
                        <Loader2 size={36} className="animate-spin text-green-600" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <p className="text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
                        <p className="text-gray-600 font-medium">El producto no existe.</p>
                        <Link to="/catalogo" className="mt-4 inline-flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 bg-green-50 border border-green-200 rounded-lg px-5 py-2.5 transition">
                            ← Volver al catálogo
                        </Link>
                    </div>
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
                    {/* Product image */}
                    <div className="bg-gray-100 rounded-3xl flex items-center justify-center p-8 min-h-100 border border-gray-200 shadow-sm">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="max-h-80 object-contain rounded-xl"
                            />
                        ) : (
                            <div className="text-gray-400">Imagen no disponible</div>
                        )}
                    </div>

                    {/* Product details */}
                    <div className="space-y-6">

                        {/* Show categories */}
                        <span className="inline-block text-xs uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 font-semibold">
                          {product?.categories?.length
                            ? product.categories.map((cat) => cat.nombre).join(", ")
                            : "Sin categoría"}
                        </span>

                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-3xl font-bold text-green-600">
                                {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                    {formatPrice(product.originalPrice)}
                                </span>
                            )}
                            {product.discount && (
                                <span className="bg-red-100 text-red-600 text-sm font-semibold px-2.5 py-0.5 rounded-full">
                                    {product.discount}
                                </span>
                            )}
                        </div>

                        {product.inStock ? (
                            <p className="flex items-center gap-1.5 text-sm font-medium text-green-600">
                                <Check className="h-4 w-4" />
                                En stock
                            </p>
                        ) : (
                            <p className="flex items-center text-sm font-medium text-red-600">Sin stock</p>
                        )}

                        {product.description && (
                            <div>
                                <h2 className="font-semibold text-gray-900 mb-2">Descripción</h2>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                            </div>
                        )}
{/*
                        {product.distributor && (
                            <p className="text-sm text-gray-600">
                                Distribuido por <strong>{product.distributor}</strong>
                            </p>
                        )}*/}

                        <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">

                                {/* Reduce quantity */}
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="p-3 hover:bg-gray-50 text-gray-600 cursor-pointer transition"
                                    aria-label="Reducir cantidad"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-4 py-2 min-w-12 text-center font-semibold text-gray-900 border-x border-gray-200">
                                    {quantity}
                                </span>

                                {/* Increase quantity */}
                                <button
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    disabled={quantity >= (product.maxStock ?? product.stock ?? 0)}
                                    className="p-3 cursor-pointer hover:bg-gray-50 text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition"
                                    aria-label="Aumentar cantidad"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Show subtotal */}
                            <p className="text-sm text-gray-600">
                                Total: <strong className="text-gray-900">{formatPrice(Number(subtotal))}</strong>
                            </p>
                        </div>

                        {cartError && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">{cartError}</p>
                        )}

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={adding || !product.inStock}
                            className="w-full cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 text-white font-semibold shadow-lg shadow-green-600/25 hover:bg-green-700 transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
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
