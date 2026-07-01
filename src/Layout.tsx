import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import SettingsOverlay from "./components/SettingsOverlay";
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
            </div>
        </UIContextProvider>
    );
}