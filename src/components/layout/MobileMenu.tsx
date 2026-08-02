import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  Settings,
  ShoppingBag,
  LogIn,
  UserPlus,
} from "lucide-react";
import { UseAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";

type MobileMenuProps = {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

export const MobileMenu = ({ isOpen, onToggle, onClose }: MobileMenuProps) => {
  const { session, signOut } = UseAuth();
  const { openOverlay } = useUI();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const username = session?.user.email?.split("@")[0] || "Usuario";
  const firstName = session?.user.user_metadata.nombre;
  const firstLetter = username.charAt(0).toUpperCase();
  const displayName = firstName || username;

  const handleMyOrders = () => {
    onClose();
    navigate("/cuenta/pedidos");
  };

  const handleSettings = () => {
    onClose();
    openOverlay("settings");
    navigate("/cuenta/configuracion");
  };

  const handleLogout = async () => {
    onClose();
    await signOut();
    navigate("/login");
  };

  return (
    <div ref={menuRef} className="sm:hidden">
      <button
        onClick={onToggle}
        className="p-2 cursor-pointer rounded-lg hover:bg-gray-100 transition text-gray-700"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className={`fixed mt-2.5 left-0 right-0 z-50 h-full w-2/3 max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {" "}
          {session ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-9 h-9 shrink-0 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
                  {firstLetter}
                </div>
                <span className="text-sm font-medium text-gray-900 truncate">
                  {displayName}
                </span>
              </div>

              <button
                onClick={handleMyOrders}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <ShoppingBag size={18} className="text-gray-600" />
                Mis pedidos
              </button>

              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                <Settings size={18} className="text-gray-600" />
                Configuración
              </button>

              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center gap-2 *:text-gray-700 hover:text-gray-900 font-medium m-3"
                >
                  <LogIn size={18} className="text-gray-600" />
                  Iniciar sesión
              </Link>

              <Link
                  to="/signup"
                  onClick={onClose}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium m-3"
                >
                  <UserPlus size={18} className="text-white" />
                  Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
