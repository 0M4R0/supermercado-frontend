import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, ShoppingBag } from "lucide-react";
import { UseAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";

export const UserDropdown = () => {
    const { session, signOut } = UseAuth();
    const { openOverlay } = useUI();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    if (!session) {
        return null
    };

    const username = session.user.email?.split("@")[0] || "Usuario";
    const firstName = session.user.user_metadata.nombre;
    const firstLetter = username.charAt(0).toUpperCase();

    const checkUsername = () => {
        if (!firstName) {
            return username
        } else {
            return firstName
        }
    }

    const handleMyOrders = () => {
        setIsOpen(false);
        navigate("/cuenta/pedidos");
    };

    const handleSettings = () => {
        setIsOpen(false);
        openOverlay("settings");
        navigate("/cuenta/configuracion");
    };

    const handleLogout = async () => {
        setIsOpen(false);
        await signOut();
        navigate("/login");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-green-500"
            >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                    {firstLetter}
                </div>

                {/* Username and chevron */}
                <span className="hidden sm:inline text-sm font-medium text-gray-900">
                    {checkUsername()}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-600 transition ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in duration-100">

                    {/* Menu items */}
                    <button
                        onClick={handleMyOrders}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                        <ShoppingBag size={18} className="text-gray-600" />
                        <span>Mis pedidos</span>
                    </button>

                    <button
                        onClick={handleSettings}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                        <Settings size={18} className="text-gray-600" />
                        <span>Configuración</span>
                    </button>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                        >
                            <LogOut size={18} />
                            <span>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
