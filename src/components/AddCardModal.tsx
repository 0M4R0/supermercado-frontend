import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createCard } from "../api/paymentMethods";
import { UseAuth } from "../context/AuthContext";
import type { SavedCard } from "../types/checkout";

type AddCardModalProps = {
    metodoPagoId: number;
    onClose: () => void;
    onCreated: (card: SavedCard) => void;
};

const BRANDS = [
    { value: "visa", label: "Visa" },
    { value: "mastercard", label: "Mastercard" },
];

export const AddCardModal = ({ metodoPagoId, onClose, onCreated }: AddCardModalProps) => {
    const { session } = UseAuth();
    const [ultimos4, setUltimos4] = useState("");
    const [alias, setAlias] = useState("");
    const [marca, setMarca] = useState("visa");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const hasData = ultimos4 || alias.trim();

    const handleClose = () => {
        if (hasData && !loading) {
            const shouldClose = window.confirm("Estas seguro de que quieres salir y perder tu progreso?");
            if (shouldClose) onClose();
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ultimos4.length !== 4 || !/^\d{4}$/.test(ultimos4)) {
            setError("Los últimos 4 dígitos deben ser exactamente 4 números");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const card = await createCard(session!.access_token, {
                metodo_pago_id: metodoPagoId,
                ultimos_4: ultimos4,
                alias: alias.trim() || undefined,
                marca,
            });
            onCreated(card);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar tarjeta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Nueva tarjeta</h3>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alias</label>
                        <input
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ej: Visa personal"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Últimos 4 dígitos *</label>
                        <input
                            value={ultimos4}
                            onChange={(e) => setUltimos4(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="4242"
                            maxLength={4}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                        <select
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {BRANDS.map((b) => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                            ))}
                        </select>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
