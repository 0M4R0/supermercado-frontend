import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Loader2, MapPin, CreditCard, ChevronLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { UseAuth } from "../context/AuthContext";
import { fetchUbicaciones } from "../api/ubicaciones";
import { fetchMetodosPagoCatalogo, fetchSavedCards } from "../api/paymentMethods";
import { createOrder } from "../api/checkout";
import { AddLocationModal } from "./AddLocationModal";
import { AddCardModal } from "./AddCardModal";
import { formatPrice } from "../utils/formatPrice";
import type { Ubicacion, MetodoPagoCatalogo, SavedCard, CheckoutPayload } from "../types/checkout";

type Step = "location" | "payment" | "review";

type CheckoutModalProps = {
    onClose: () => void;
    onComplete: () => void;
};

export const CheckoutModal = ({ onClose, onComplete }: CheckoutModalProps) => {
    const navigate = useNavigate();
    const { session } = UseAuth();
    const { cart } = useCart();
    const token = session!.access_token;

    const [step, setStep] = useState<Step>("location");

    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [selectedUbicacion, setSelectedUbicacion] = useState<Ubicacion | null>(null);
    const [ubicacionesLoading, setUbicacionesLoading] = useState(true);

    const [metodosCatalogo, setMetodosCatalogo] = useState<MetodoPagoCatalogo[]>([]);
    const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<{ type: "cash"; id: number } | { type: "card"; card: SavedCard } | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(true);

    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState("");

    const [showAddLocation, setShowAddLocation] = useState(false);
    const [showAddCard, setShowAddCard] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [ubicacionesData, cardsData] = await Promise.all([
                    fetchUbicaciones(token),
                    fetchSavedCards(token),
                ]);
                setUbicaciones(ubicacionesData);
                setSavedCards(cardsData);

                const defaultLoc = ubicacionesData.find((u) => u.por_defecto) ?? ubicacionesData[0];
                if (defaultLoc) setSelectedUbicacion(defaultLoc);

                const catalogoData = await fetchMetodosPagoCatalogo(token).catch(() => null);
                if (catalogoData) setMetodosCatalogo(catalogoData);
            } catch {
                setError("Error al cargar datos");
            } finally {
                setUbicacionesLoading(false);
                setPaymentLoading(false);
            }
        };
        load();
    }, [token]);

    const cashMethod = metodosCatalogo.length > 0
        ? metodosCatalogo.find(
            (m) => m.nombre.toLowerCase() === "efectivo" || m.nombre.toLowerCase() === "cash" || m.nombre.toLowerCase() === "contado"
        ) ?? metodosCatalogo[0]
        : { id: 1, nombre: "Efectivo" };

    const cardCatalogMethod = metodosCatalogo.length > 0
        ? metodosCatalogo.find(
            (m) => m.nombre.toLowerCase() !== "efectivo" && m.nombre.toLowerCase() !== "cash" && m.nombre.toLowerCase() !== "contado"
        ) ?? metodosCatalogo[0]
        : { id: 2, nombre: "Tarjeta" };

    const handleConfirm = async () => {
        if (!selectedUbicacion || !selectedPayment) return;

        setConfirming(true);
        setError("");

        const payload: CheckoutPayload = {
            ubicacion_id: selectedUbicacion.id,
        };

        if (selectedPayment.type === "cash") {
            payload.metodo_pago_id = selectedPayment.id;
        } else {
            payload.usuario_metodo_pago_id = selectedPayment.card.id;
        }

        try {
            await createOrder(token, payload);
            onComplete();
            navigate("/cuenta/pedidos");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear el pedido");
        } finally {
            setConfirming(false);
        }
    };

    const handleLocationCreated = (ubicacion: Ubicacion) => {
        setUbicaciones((prev) => [...prev, ubicacion]);
        setSelectedUbicacion(ubicacion);
        setShowAddLocation(false);
    };

    const handleCardCreated = (card: SavedCard) => {
        setSavedCards((prev) => [...prev, card]);
        setSelectedPayment({ type: "card", card });
        setShowAddCard(false);
    };

    const isValid = () => {
        if (step === "location") return !!selectedUbicacion;
        if (step === "payment") return !!selectedPayment;
        return true;
    };

    const handleCloseConfirm = () => {
        const shouldClose = window.confirm("Estas seguro de que quieres salir y perder tu progreso?");
        if (shouldClose) onClose();
    };


    const renderStepIndicator = () => (
        <div className="flex items-center gap-2 mb-6">
            {(["location", "payment", "review"] as Step[]).map((s, i) => {
                const currentIndex = ["location", "payment", "review"].indexOf(step);
                const idx = ["location", "payment", "review"].indexOf(s);
                const completed = idx < currentIndex;
                const active = idx === currentIndex;
                const labels: Record<Step, string> = { location: "Ubicación", payment: "Pago", review: "Revisar" };
                return (
                    <div key={s} className="flex items-center gap-2">
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                completed || active
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-200 text-gray-500"
                            }`}
                        >
                            {completed ? <Check size={14} /> : i + 1}
                        </div>
                        <span className={`text-sm font-medium ${active ? "text-gray-900" : "text-gray-400"}`}>
                            {labels[s]}
                        </span>
                        {i < 2 && <div className={`w-8 h-0.5 ${idx < currentIndex ? "bg-green-600" : "bg-gray-200"}`} />}
                    </div>
                );
            })}
        </div>
    );

    const renderStep = () => {
        switch (step) {
            case "location":
                return (
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900">Seleccionar dirección de entrega</h3>

                        {ubicacionesLoading ? (
                            <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {ubicaciones.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => setSelectedUbicacion(u)}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition cursor-pointer ${
                                            selectedUbicacion?.id === u.id
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <MapPin size={18} className="mt-0.5 shrink-0 text-gray-500" />
                                            <div>
                                                <p className="font-medium text-gray-900">{u.direccion}</p>
                                                <p className="text-sm text-gray-500">
                                                    {u.ciudad}, {u.provincia}
                                                </p>
                                                {u.direccion_extra && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{u.direccion_extra}</p>
                                                )}
                                                {u.por_defecto && (
                                                    <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                        Por defecto
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowAddLocation(true)}
                            className="w-full text-sm text-green-600 font-medium hover:text-green-700 transition py-2 cursor-pointer"
                        >
                            + Agregar nueva dirección
                        </button>

                        {showAddLocation && (
                            <AddLocationModal
                                onClose={() => setShowAddLocation(false)}
                                onCreated={handleLocationCreated}
                            />
                        )}
                    </div>
                );

            case "payment":
                return (
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900">Seleccionar método de pago</h3>

                        {paymentLoading ? (
                            <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {cashMethod && (
                                    <button
                                        onClick={() => setSelectedPayment({ type: "cash", id: cashMethod.id })}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition cursor-pointer ${
                                            selectedPayment?.type === "cash"
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={18} className="text-gray-500" />
                                            <div>
                                                <p className="font-medium text-gray-900">Efectivo</p>
                                                <p className="text-sm text-gray-500">Pagar al recibir</p>
                                            </div>
                                        </div>
                                    </button>
                                )}

                                {savedCards.length > 0 && <hr className="border-gray-200" />}

                                {savedCards.map((card) => (
                                    <button
                                        key={card.id}
                                        onClick={() => setSelectedPayment({ type: "card", card })}
                                        className={`w-full text-left p-3 rounded-xl border-2 transition cursor-pointer ${
                                            selectedPayment?.type === "card" && selectedPayment.card.id === card.id
                                                ? "border-green-500 bg-green-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <CreditCard size={18} className="text-gray-500" />
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {card.alias ?? "Tarjeta"} {card.marca && `(${card.marca})`}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    **** {card.ultimos_4}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => setShowAddCard(true)}
                            className="w-full text-sm text-green-600 font-medium hover:text-green-700 transition py-2 cursor-pointer"
                        >
                            + Agregar nueva tarjeta
                        </button>

                        {showAddCard && (
                            <AddCardModal
                                metodoPagoId={cardCatalogMethod.id}
                                onClose={() => setShowAddCard(false)}
                                onCreated={handleCardCreated}
                            />
                        )}
                    </div>
                );

            case "review":
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">Confirmar pedido</h3>

                        {selectedUbicacion && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Entrega</p>
                                <div className="flex items-start gap-2">
                                    <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-700 font-medium">{selectedUbicacion.direccion}</p>
                                        <p className="text-xs text-gray-500">
                                            {selectedUbicacion.ciudad}, {selectedUbicacion.provincia}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedPayment && (
                            <div className="bg-gray-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Pago</p>
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-gray-400" />
                                    {selectedPayment.type === "cash" ? (
                                        <p className="text-sm text-gray-700 font-medium">Efectivo</p>
                                    ) : (
                                        <p className="text-sm text-gray-700 font-medium">
                                            **** {selectedPayment.card.ultimos_4}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                            <p className="text-xs text-gray-500 uppercase font-semibold">Productos</p>
                            {cart?.articulos.map((item) => (
                                <div key={item.articulo_carrito_id} className="flex justify-between text-sm">
                                    <span className="text-gray-700">
                                        {item.productos?.nombre ?? "Producto"} x{item.cantidad}
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {formatPrice(item.precio_unitario * item.cantidad)}
                                    </span>
                                </div>
                            ))}
                            <hr className="border-gray-200" />
                            <div className="flex justify-between text-base font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatPrice(cart?.subtotal ?? 0)}</span>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const handleClose = () => {
        handleCloseConfirm();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleClose}>
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-2">
                    {step !== "location" ? (
                        <button
                            onClick={() => {
                                if (step === "payment") setStep("location");
                                if (step === "review") setStep("payment");
                            }}
                            className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 cursor-pointer"
                        >
                            <ChevronLeft size={22} />
                        </button>
                    ) : (
                        <div />
                    )}
                    <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 cursor-pointer">
                        <X size={22} />
                    </button>
                </div>

                {renderStepIndicator()}

                {error && (
                    <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded-lg">{error}</p>
                )}

                {renderStep()}

                <div className="flex gap-3 mt-6">
                    {step !== "review" ? (
                        <button
                            onClick={() => {
                                if (step === "location") setStep("payment");
                                else if (step === "payment") setStep("review");
                            }}
                            disabled={!isValid()}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            Continuar
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirm}
                            disabled={confirming}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            {confirming ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Confirmar pedido"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
