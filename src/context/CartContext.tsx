import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    addToCarrito as addToCarritoApi,
    clearCarrito as clearCarritoApi,
    fetchCarrito,
    removeFromCarrito as removeFromCarritoApi,
    updateCarritoItem as updateCarritoItemApi,
} from "../api/carrito";
import { ApiError } from "../lib/api";
import { UseAuth } from "./AuthContext";
import type { ApiCarrito } from "../types/api";

type CartContextType = {
    cart: ApiCarrito | null;
    loading: boolean;
    refreshCart: () => Promise<void>;
    addToCart: (productoId: number, cantidad?: number) => Promise<void>;
    updateItemQuantity: (articuloId: number, cantidad: number) => Promise<void>;
    removeItem: (articuloId: number) => Promise<void>;
    clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const { session } = UseAuth();
    const [cart, setCart] = useState<ApiCarrito | null>(null);
    const [loading, setLoading] = useState(false);

    const token = session?.access_token;

    const refreshCart = useCallback(async () => {
        if (!token) {
            setCart(null);
            return;
        }

        setLoading(true);
        try {
            const data = await fetchCarrito(token);
            setCart(data);
        } catch {
            setCart(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const requireToken = () => {
        if (!token) {
            throw new ApiError("Debes iniciar sesión para usar el carrito", 401);
        }
        return token;
    };

    const addToCart = async (productoId: number, cantidad = 1) => {
        const authToken = requireToken();
        const data = await addToCarritoApi(authToken, { producto_id: productoId, cantidad });
        setCart(data);
    };

    const updateItemQuantity = async (articuloId: number, cantidad: number) => {
        const authToken = requireToken();
        const data = await updateCarritoItemApi(authToken, articuloId, { cantidad });
        setCart(data);
    };

    const removeItem = async (articuloId: number) => {
        const authToken = requireToken();
        const data = await removeFromCarritoApi(authToken, articuloId);
        setCart(data);
    };

    const clearCart = async () => {
        const authToken = requireToken();
        const data = await clearCarritoApi(authToken);
        setCart(data);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                refreshCart,
                addToCart,
                updateItemQuantity,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
