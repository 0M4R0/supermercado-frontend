import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import SettingsOverlay from "./components/settings/SettingsOverlay";
import CartSidePanel from "./components/cart/CartSidePanel";
import { UIContextProvider } from "./context/UIContext";
import Footer from "./components/layout/Footer";

export default function Layout() {
  return (
    <UIContextProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1">
          <Outlet />
        </div>

        <Footer />

        {/* Global Overlays */}
        <SettingsOverlay />
        <CartSidePanel />
      </div>
    </UIContextProvider>
  );
}
