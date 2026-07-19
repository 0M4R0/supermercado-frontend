import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createUbicacion } from "../api/ubicaciones";
import { UseAuth } from "../context/AuthContext";
import type { Ubicacion } from "../types/checkout";

type AddLocationModalProps = {
    onClose: () => void;
    onCreated: (location: Ubicacion) => void;
};

export const AddLocationModal = ({ onClose, onCreated }: AddLocationModalProps) => {
    const { session } = UseAuth();
    const [direccion, setDireccion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [provincia, setProvincia] = useState("");
    const [direccionExtra, setDireccionExtra] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const hasData = direccion.trim() || ciudad.trim() || provincia.trim() || direccionExtra.trim();

    const handleClose = () => {
        if (hasData && !loading) {
            const shouldClose = window.confirm("Perderas los datos ingresados si sales sin guardar?");
            if (shouldClose) onClose();
        } else {
            onClose();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!direccion.trim() || !ciudad.trim() || !provincia.trim()) {
            setError("Dirección, ciudad y provincia son obligatorios");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const ubicacion = await createUbicacion(session!.access_token, {
                direccion: direccion.trim(),
                ciudad: ciudad.trim(),
                provincia: provincia.trim(),
                direccion_extra: direccionExtra.trim() || undefined,
            });
            onCreated(ubicacion);
        } catch (err ) {
            setError("Error al crear dirección");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Nueva dirección</h3>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
                        <input
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Calle y número"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad *</label>
                            <input
                                value={ciudad}
                                onChange={(e) => setCiudad(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
                            <input
                                value={provincia}
                                onChange={(e) => setProvincia(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección adicional</label>
                        <input
                            value={direccionExtra}
                            onChange={(e) => setDireccionExtra(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Piso, depto, etc."
                        />
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
