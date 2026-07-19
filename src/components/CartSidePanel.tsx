import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, X, Minus, Plus, Trash2 } from "lucide-react";
import { useUI } from "../context/UIContext";
import { useCart } from "../context/CartContext";
import { UseAuth } from "../context/AuthContext";
import { fetchProductoById } from "../api/productos";
import { CheckoutModal } from "./CheckoutModal";
import { formatPrice } from "../utils/formatPrice";

function unwrapMaxStock(
    value: { max_stock: number } | { max_stock: number }[] | null | undefined
): number | undefined {
    if (value == null) return undefined;
    const item = Array.isArray(value) ? value[0] : value;
    return item?.max_stock;
}

export const CartSidePanel = () => {
    const { activeOverlay, closeOverlay } = useUI();
    const { cart, updateItemQuantity, removeItem } = useCart();
    const { session } = UseAuth();
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);
    const [stockMap, setStockMap] = useState<Record<number, number>>({});
    const [stockLoading, setStockLoading] = useState<Record<number, boolean>>({});
    const [stockErrors, setStockErrors] = useState<Record<number, string>>({});

    const handleCheckoutComplete = () => {
        setShowCheckout(false);
        closeOverlay();
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && activeOverlay === "cart") {
                closeOverlay();
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [activeOverlay, closeOverlay]);

    if (activeOverlay !== "cart") return null;

    const isOpen = activeOverlay === "cart";

    const handleLogin = () => {
        closeOverlay();
        navigate("/login");
    };

    const handleGoToCatalog = () => {
        closeOverlay();
        navigate("/catalogo");
    };

    const handleQuantityChange = async (
        articuloId: number,
        productoId: number,
        currentQty: number,
        delta: number
    ) => {
        const newQty = currentQty + delta;

        if (newQty < 1) {
            await removeItem(articuloId);
            return;
        }

        if (delta > 0) {
            let available = stockMap[productoId];

            if (available === undefined) {
                setStockLoading((prev) => ({ ...prev, [articuloId]: true }));
                try {
                    const producto = await fetchProductoById(productoId);
                    available = unwrapMaxStock(producto.producto_inventario) ?? 0;
                    setStockMap((prev) => ({ ...prev, [productoId]: available }));
                } catch {
                    setStockLoading((prev) => ({ ...prev, [articuloId]: false }));
                    await updateItemQuantity(articuloId, newQty);
                    return;
                }
                setStockLoading((prev) => ({ ...prev, [articuloId]: false }));
            }

            if (currentQty >= available) {
                setStockErrors((prev) => ({
                    ...prev,
                    [articuloId]: `Máximo ${available} unidades por cliente`,
                }));
                return;
            }
        }

        setStockErrors((prev) => ({ ...prev, [articuloId]: "" }));
        await updateItemQuantity(articuloId, newQty);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
                onClick={closeOverlay}
            />

            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={22} className="text-green-600" />
                        <h2 className="text-lg font-bold text-gray-900">Carrito</h2>
                    </div>
                    <button
                        onClick={closeOverlay}
                        className="p-2 cursor-pointer hover:bg-gray-100 rounded-lg transition text-gray-500"
                        aria-label="Cerrar carrito"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {!session ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <ShoppingCart size={56} className="text-gray-300" />
                            <p className="text-gray-600 text-lg font-medium">
                                Debe iniciar sesión para utilizar el carrito
                            </p>
                            <button
                                onClick={handleLogin}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium cursor-pointer"
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    ) : !cart || cart.articulos.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <ShoppingCart size={56} className="text-gray-300" />
                            <p className="text-black-600 text-lg font-bold">
                                Tu carrito está vacío
                            </p>
                            <p className="text-gray-600 text-sm font-medium">
                                Agrega productos para comenzar
                            </p>
                            <button
                                onClick={handleGoToCatalog}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium"
                            >
                                Ver catálogo
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.articulos.map((item) => (
                                <div
                                    key={item.articulo_carrito_id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    {item.productos?.imagen_producto ? (
                                        <img
                                            src={item.productos.imagen_producto}
                                            alt={item.productos.nombre}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                            Sin img
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 truncate">
                                            {item.productos?.nombre ?? "Producto"}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {formatPrice(item.precio_unitario)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">

                                            {/* Remove item cart side panel */}
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.articulo_carrito_id,
                                                        item.producto_id,
                                                        item.cantidad,
                                                        -1
                                                    )
                                                }
                                                className="p-1 cursor-pointer rounded-md hover:bg-gray-200 transition text-gray-600"
                                                aria-label="Disminuir cantidad"
                                            >
                                                {item.cantidad === 1 ? (
                                                    <Trash2 size={16} />
                                                ) : (
                                                    <Minus size={16} />
                                                )}
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                                                {item.cantidad}
                                            </span>

                                            {/* Add item cart side panel */}
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.articulo_carrito_id,
                                                        item.producto_id,
                                                        item.cantidad,
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    stockLoading[item.articulo_carrito_id] ||
                                                    (stockMap[item.producto_id] !== undefined &&
                                                        item.cantidad >= stockMap[item.producto_id])
                                                }
                                                className="p-1 cursor-pointer rounded-md hover:bg-gray-200 transition text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed"
                                                aria-label="Aumentar cantidad"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        {stockErrors[item.articulo_carrito_id] && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {stockErrors[item.articulo_carrito_id]}
                                            </p>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900 whitespace-nowrap">
                                        {formatPrice(item.precio_unitario * item.cantidad)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {session && cart && cart.articulos.length > 0 && (
                    <div className="border-t border-gray-200 p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="text-lg font-bold text-gray-900">
                                {formatPrice(cart.subtotal)}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700 transition cursor-pointer"
                        >
                            Pagar
                        </button>
                    </div>
                )}
            </div>

            {showCheckout && (
                <CheckoutModal
                    onClose={() => setShowCheckout(false)}
                    onComplete={handleCheckoutComplete}
                />
            )}
        </>
    );
};

export default CartSidePanel;
