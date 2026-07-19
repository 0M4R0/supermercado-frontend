import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useUI } from "../context/UIContext";
import {
    ProfileTab,
    AddressesTab,
    PaymentMethodsTab,
    AppearanceTab,
    SecurityTab,
} from "./SettingsTabs";

type TabType = "profile" | "addresses" | "payment" | "appearance" | "security";

export const SettingsOverlay = () => {
    const { activeOverlay, closeOverlay } = useUI();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    const tabs: { id: TabType; label: string }[] = [
        { id: "profile", label: "Perfil" },
        { id: "addresses", label: "Direcciones" },
        { id: "payment", label: "Métodos de pago" },
        { id: "appearance", label: "Apariencia" },
        { id: "security", label: "Seguridad" },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "profile":
                return <ProfileTab />;
            case "addresses":
                return <AddressesTab />;
            case "payment":
                return <PaymentMethodsTab />;
            case "appearance":
                return <AppearanceTab />;
            case "security":
                return <SecurityTab />;
            default:
                return <ProfileTab />;
        }
    };
    
    const handleClose = useCallback(() => {
        closeOverlay();
        navigate("/home");
    }, [closeOverlay, navigate]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && activeOverlay === "settings") {
                handleClose();
            }
        };

        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [activeOverlay, handleClose]);


    if (activeOverlay !== "settings") return null;

    return (
        <>
            {/* Settings Panel */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={handleClose}
            >
                <div
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sidebar */}
                    <div className="hidden md:flex w-64 bg-gray-50 border-r border-gray-200 flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Configuración</h2>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full cursor-pointer text-left px-4 py-3 rounded-lg font-medium transition ${
                                        activeTab === tab.id
                                            ? "bg-green-100 text-green-700"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col">
                        {/* Header with close button */}
                        <div className="flex items-center justify-between p-4.5 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {tabs.find((t) => t.id === activeTab)?.label}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 cursor-pointer"
                                aria-label="Cerrar"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tab content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {renderTabContent()}
                        </div>

                        {/* Mobile tab selector */}
                        <div className="md:hidden border-t border-gray-200 p-4 bg-gray-50">
                            <select
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value as TabType)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                {tabs.map((tab) => (
                                    <option key={tab.id} value={tab.id}>
                                        {tab.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsOverlay;
