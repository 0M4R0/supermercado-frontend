import { useState } from "react";
import { UseAuth } from "../context/AuthContext";

export const ProfileTab = () => {
    const { session } = UseAuth();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // Aquí irá la lógica para guardar el perfil
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
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Tu nombre"
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Apellido</label>
                            <input
                                type="text"
                                value={session?.user.user_metadata.apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                placeholder="Tu apellido"
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
    const [addresses] = useState([]);
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Mis Direcciones</h3>
                {addresses.length === 0 ? (
                    <p className="text-gray-500">No tienes direcciones guardadas.</p>
                ) : (
                    <div className="space-y-3">
                        {addresses.map((addr: any, idx: number) => (
                            <div
                                key={idx}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
                            >
                                <p className="font-medium">{addr.label}</p>
                                <p className="text-sm text-gray-600">{addr.address}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
            >
                {showForm ? "Cancelar" : "Agregar dirección"}
            </button>
            {showForm && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <input
                        type="text"
                        placeholder="Etiqueta (ej: Casa, Trabajo)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                        placeholder="Dirección completa"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Guardar dirección
                    </button>
                </div>
            )}
        </div>
    );
};

export const PaymentMethodsTab = () => {
    const [methods] = useState([]);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>
                {methods.length === 0 ? (
                    <p className="text-gray-500">No tienes métodos de pago guardados.</p>
                ) : (
                    <div className="space-y-3">
                        {methods.map((method: any, idx: number) => (
                            <div
                                key={idx}
                                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition"
                            >
                                <p className="font-medium">{method.type}</p>
                                <p className="text-sm text-gray-600">{method.last4}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className="px-6 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Agregar método de pago
            </button>
        </div>
    );
};

export const AppearanceTab = () => {
    const { darkMode, toggleDarkMode } = useUI();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Preferencias de Apariencia</h3>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                        <p className="font-medium">Modo oscuro</p>
                        <p className="text-sm text-gray-600">Cambia la apariencia de la aplicación</p>
                    </div>
                    <button
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
                <h3 className="text-lg font-semibold mb-4">Seguridad</h3>
                <button
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

// Helper to import useUI
import { useUI } from "../context/UIContext";
