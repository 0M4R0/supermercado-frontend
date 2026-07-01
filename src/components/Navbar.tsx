import { Link } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { UseAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { UserDropdown } from "./UserDropdown";

const Navbar = () => {
    const { session } = UseAuth();
    const { cart } = useCart();
    const totalItems = cart?.total_items ?? 0;

    return (
        <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center">
            <nav className="w-full flex justify-between items-center px-6">
                <Link
                    to="/home"
                    className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-green-600 transition"
                >
                    <Store size={24} className="text-green-600" />
                    <span>Supermercado</span>
                </Link>

                <div className="flex items-center gap-4">
                    {session && (
                        <Link
                            to="/catalogo"
                            className="relative flex items-center gap-1.5 text-gray-700 hover:text-green-600 transition"
                            aria-label={`Carrito con ${totalItems} artículos`}
                        >
                            <ShoppingCart size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-xs font-semibold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}

                    {session ? (
                        <UserDropdown />
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 font-medium"
                            >
                                Iniciar sesión
                            </Link>

                            <Link
                                to="/signup"
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                            >
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
