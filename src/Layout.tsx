import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import SettingsOverlay from "./components/SettingsOverlay";
import CartSidePanel from "./components/CartSidePanel";
import { UIContextProvider } from "./context/UIContext";

export default function Layout() {
  return (
    <UIContextProvider>
      <div className="h-full flex">
        <Navbar />

        <div className="flex-1">
          <Outlet />
        </div>

        {/* Global Overlays */}
        <SettingsOverlay />
        <CartSidePanel />
      </div>
    </UIContextProvider>
  );
}
