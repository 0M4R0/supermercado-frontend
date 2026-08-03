import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useUI } from "../../context/UIContext";
import { UserDropdown } from "./UserDropdown";
import { MobileMenu } from "./MobileMenu";

const Navbar = () => {
    const { session } = useAuth();
    const { cart } = useCart();
    const { openOverlay } = useUI();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const totalItems = cart?.total_items ?? 0;

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm flex items-center">
            <nav className="w-full flex justify-between items-center px-6">
                <div className="flex items-center gap-2">
                    <MobileMenu
                        isOpen={mobileMenuOpen}
                        onToggle={() => setMobileMenuOpen((prev) => !prev)}
                        onClose={closeMobileMenu}
                    />

                    <Link
                        to="/home"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 font-bold text-lg text-gray-900 hover:text-green-600 transition"
                    >
                        <Store size={24} className="text-green-600 hidden sm:block" />
                        <span>Supermercado</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => {
                            closeMobileMenu();
                            openOverlay("cart");
                        }}
                        className="relative flex items-center justify-center p-2 -mr-2 rounded-full text-gray-700 hover:text-green-600 hover:bg-green-50 transition cursor-pointer"
                        aria-label={`Carrito con ${totalItems} artículos`}
                    >
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-xs font-semibold text-white ring-2 ring-white">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    <div className="hidden sm:flex items-center gap-4">
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
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
