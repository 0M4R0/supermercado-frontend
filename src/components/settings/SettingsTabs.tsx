import { useEffect, useState } from "react";
import { Loader2, Trash2Icon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { deleteUbicacion, fetchUbicaciones } from "../../api/ubicaciones";
import { fetchSavedCards, fetchMetodosPagoCatalogo, deleteCard } from "../../api/paymentMethods";
import { AddLocationModal } from "../modals/AddLocationModal";
import { AddCardModal } from "../modals/AddCardModal";
import type { Ubicacion, SavedCard } from "../../types/checkout";

export const ProfileTab = () => {
    const { session } = useAuth();
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={session?.user.email || ""}
                            disabled
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre</label>
                            <input
                                type="text"
                                value={session?.user.user_metadata.nombre}
                                placeholder="Tu nombre"
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Apellido</label>
                            <input
                                type="text"
                                value={session?.user.user_metadata.apellido}
                                placeholder="Tu apellido"
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98] cursor-pointer"
            >
                {saving ? "Guardando..." : "Guardar cambios"}
            </button>
        </div>
    );
};

export const AddressesTab = () => {
    const { session } = useAuth();
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);;

    useEffect(() => {
        if (!session) return;
        fetchUbicaciones(session.access_token)
            .then(setUbicaciones)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const handleCreated = (ubicacion: Ubicacion) => {
        setUbicaciones((prev) => [...prev, ubicacion]);
        setShowModal(false);
    };

    const handleDeleteUbicacion = async (ubicacionId: number) => {
        if (!session) return;
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta dirección?")) return;

        setDeletingId(ubicacionId);
        try {
            await deleteUbicacion(session.access_token, ubicacionId);
            setUbicaciones((prev) => prev.filter((u) => u.id !== ubicacionId));
        } catch (err) {
            console.error("Error al eliminar ubicación:", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Mis Direcciones</h3>
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-gray-400" /></div>
                ) : ubicaciones.length === 0 ? (
                    <p className="text-gray-500">No tienes direcciones guardadas.</p>
                ) : (
                    <div className="space-y-3">
                        {ubicaciones.map((u) => (
                            <div key={u.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-sm hover:border-gray-300 transition bg-white">
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{u.direccion}</p>
                                        <p className="text-sm text-gray-600">
                                            {u.ciudad}, {u.provincia}
                                            {u.direccion_extra && ` — ${u.direccion_extra}`}
                                        </p>
                                        {u.por_defecto && (
                                            <span className="inline-block mt-1.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                Por defecto
                                            </span>
                                        )}
                                    </div>
                                    <div className="shrink-0">
                                        {/* Delete location button */}
                                        <button
                                            onClick={() => handleDeleteUbicacion(u.id)}
                                            disabled={deletingId === u.id}
                                            className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition text-red-500 cursor-pointer disabled:opacity-50"
                                            aria-label="Eliminar dirección"
                                        >
                                            <Trash2Icon size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition active:scale-[0.98] cursor-pointer"
            >
                + Agregar dirección
            </button>
            {showModal && (
                <AddLocationModal
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
};

export const PaymentMethodsTab = () => {
    const { session } = useAuth();
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [cardCatalogId, setCardCatalogId] = useState(2);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    useEffect(() => {
        if (!session) return;
        Promise.all([
            fetchSavedCards(session.access_token),
            fetchMetodosPagoCatalogo(session.access_token).catch(() => null),
        ])
            .then(([cardsData, catalogo]) => {
                setCards(cardsData);
                if (catalogo) {
                    const cardMethod = catalogo.find(
                        (m) => m.nombre.toLowerCase() !== "efectivo" && m.nombre.toLowerCase() !== "cash" && m.nombre.toLowerCase() !== "contado"
                    );
                    if (cardMethod) setCardCatalogId(cardMethod.id);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const handleCreated = (card: SavedCard) => {
        setCards((prev) => [...prev, card]);
        setShowModal(false);
    };

    const handleDeleteCard = async (cardId: number) => {
        if (!session) return;
        if (!window.confirm("¿Estás seguro de que quieres eliminar este método de pago?")) return;

        setDeletingId(cardId);
        try {
            await deleteCard(session.access_token, cardId);
            setCards((prev) => prev.filter((c) => c.id !== cardId));
        } catch (err) {
            console.error("Error al eliminar método de pago:", err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>
                {loading ? (
                    <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-gray-400" /></div>
                ) : cards.length === 0 ? (
                    <p className="text-gray-500">No tienes métodos de pago guardados.</p>
                ) : (
                    <div className="space-y-3">
                        {cards.map((card) => (
                            <div key={card.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-sm hover:border-gray-300 transition bg-white">
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900 truncate">{card.alias ?? "Tarjeta"} {card.marca && `(${card.marca})`}</p>
                                        <p className="text-sm text-gray-600">**** {card.ultimos_4}</p>
                                    </div>
                                    <div className="shrink-0">
                                        {/* Delete payment method button */}
                                        <button
                                            onClick={() => handleDeleteCard(card.id)}
                                            disabled={deletingId === card.id}
                                            className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition text-red-500 cursor-pointer disabled:opacity-50"
                                            aria-label="Eliminar método de pago"
                                        >
                                            {deletingId === card.id ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Trash2Icon size={18} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2.5 border border-green-600 text-green-600 rounded-xl font-medium hover:bg-green-50 transition active:scale-[0.98] cursor-pointer"
            >
                + Agregar método de pago
            </button>
            {showModal && (
                <AddCardModal
                    metodoPagoId={cardCatalogId}
                    onClose={() => setShowModal(false)}
                    onCreated={handleCreated}
                />
            )}
        </div>
    );
};

export const AppearanceTab = () => {
    const { darkMode, toggleDarkMode } = useUI();

    return (
        <div className="space-y-6">
            <div>
                <span className="inline-block text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-5">En proceso</span>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-white">
                    <div>
                        <p className="font-medium text-gray-900">Modo oscuro</p>
                        <p className="text-sm text-gray-600">Cambia la apariencia de la aplicación</p>
                    </div>
                    <button
                        disabled
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition cursor-not-allowed ${
                            darkMode ? "bg-green-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition ${
                                darkMode ? "translate-x-7" : "translate-x-1"
                            }`}
                        />
                    </button>
                </div>
            </div>
      </div>
    );
};

export const SecurityTab = () => {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex flex-col">
                <span className="inline-block w-22 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 mb-4">En proceso</span>
                <button
                    disabled
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition"
                >
                    Cambiar contraseña
                </button>
            </div>
            {showPasswordForm && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    />
                    <button className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 cursor-pointer transition">
                        Actualizar contraseña
                    </button>
                </div>
            )}
        </div>
    );
};
