import { createContext, useContext, useState, type ReactNode } from "react";

type OverlayType = "settings" | "cart" | "notifications" | null;

interface UIContextType {
    activeOverlay: OverlayType;
    openOverlay: (overlay: OverlayType) => void;
    closeOverlay: () => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const UIContext = createContext<UIContextType | null>(null);

interface UIContextProviderProps {
    children: ReactNode;
}

export const UIContextProvider = ({ children }: UIContextProviderProps) => {
    const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);
    const [darkMode, setDarkMode] = useState(false);

    const openOverlay = (overlay: OverlayType) => {
        setActiveOverlay(overlay);
    };

    const closeOverlay = () => {
        setActiveOverlay(null);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <UIContext.Provider
            value={{
                activeOverlay,
                openOverlay,
                closeOverlay,
                darkMode,
                toggleDarkMode,
            }}
        >
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) {
        throw new Error("useUI must be used within UIContextProvider");
    }
    return context;
};
