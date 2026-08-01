import { useEffect, useState } from "react";
import { Loader2, Trash2Icon } from "lucide-react";
import { UseAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { deleteUbicacion, fetchUbicaciones } from "../../api/ubicaciones";
import { fetchSavedCards, fetchMetodosPagoCatalogo } from "../../api/paymentMethods";
import { AddLocationModal } from "../modals/AddLocationModal";
import { AddCardModal } from "../modals/AddCardModal";
import type { Ubicacion, SavedCard } from "../../types/checkout";

export const ProfileTab = () => {
    const { session } = UseAuth();
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
            >
                {saving ? "Guardando..." : "Guardar cambios"}
            </button>
        </div>
    );
};

export const AddressesTab = () => {
    const { session } = UseAuth();
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
                            <div key={u.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition">
                                <div className="flex flex-row justify-between items-center mb-2">
                                    <div>
                                        <p className="font-medium">{u.direccion}</p>
                                        <p className="text-sm text-gray-600">
                                            {u.ciudad}, {u.provincia}
                                            {u.direccion_extra && ` — ${u.direccion_extra}`}
                                        </p>
                                        {u.por_defecto && (
                                            <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                Por defecto
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        {/* Delete location button */}
                                        <button
                                            onClick={() => handleDeleteUbicacion(u.id)}
                                            disabled={deletingId === u.id}
                                            className="p-1 hover:bg-red-500 hover:text-white rounded-lg transition text-red-500 cursor-pointer">
                                            <Trash2Icon></Trash2Icon>
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
                className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition cursor-pointer"
            >
                Agregar dirección
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
    const { session } = UseAuth();
    const [cards, setCards] = useState<SavedCard[]>([]);
    const [cardCatalogId, setCardCatalogId] = useState(2);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

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
                            <div key={card.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition">
                                <p className="font-medium">{card.alias ?? "Tarjeta"} {card.marca && `(${card.marca})`}</p>
                                <p className="text-sm text-gray-600">**** {card.ultimos_4}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={() => setShowModal(true)}
                className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition cursor-pointer"
            >
                Agregar método de pago
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
                <p className="text-sm text-red-600 font-semibold pb-5">En proceso</p>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                        <p className="font-medium">Modo oscuro</p>
                        <p className="text-sm text-gray-600">Cambia la apariencia de la aplicación</p>
                    </div>
                    <button
                        disabled
                        onClick={toggleDarkMode}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition ${
                            darkMode ? "bg-green-600" : "bg-gray-300"
                        }`}
                    >
                        <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
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
            <div>
                <p className="text-sm text-red-600 font-semibold pb-5">En proceso</p>
                <button
                    disabled
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    Cambiar contraseña
                </button>
            </div>
            {showPasswordForm && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <input
                        type="password"
                        placeholder="Contraseña actual"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Actualizar contraseña
                    </button>
                </div>
            )}
        </div>
    );
};
