import { useMemo, useState } from "react";
import { X, Loader2, CreditCard } from "lucide-react";
import { createCard } from "../../api/paymentMethods";
import { useAuth } from "../../context/AuthContext";
import type { SavedCard } from "../../types/checkout";

type AddCardModalProps = {
    metodoPagoId: number;
    onClose: () => void;
    onCreated: (card: SavedCard) => void;
};

type CardBrand = "visa" | "mastercard" | "unknown";

const BRAND_LABELS: Record<CardBrand, string> = {
    visa: "Visa",
    mastercard: "Mastercard",
    unknown: "Tarjeta",
};

/** Digits only from a card/expiry/cvc input. */
function onlyDigits(value: string): string {
    return value.replace(/\D/g, "");
}

/** Format card number as groups of 4: 4242 4242 4242 4242 */
function formatCardNumber(digits: string): string {
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Format expiry as MM/YY while typing. */
function formatExpiry(digits: string): string {
    const cleaned = digits.slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
}

function detectBrand(cardDigits: string): CardBrand {
    if (/^4/.test(cardDigits)) return "visa";
    if (/^5[1-5]/.test(cardDigits) || /^2(2[2-9]|[3-6]\d|7[01]|720)/.test(cardDigits)) {
        return "mastercard";
    }
    return "unknown";
}

/** Basic Luhn check so the number feels "kind of real". */
function isValidLuhn(cardDigits: string): boolean {
    if (cardDigits.length < 13) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = cardDigits.length - 1; i >= 0; i--) {
        let digit = Number(cardDigits[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
}

function isValidExpiry(mmYy: string): boolean {
    const match = /^(\d{2})\/(\d{2})$/.exec(mmYy);
    if (!match) return false;

    const month = Number(match[1]);
    const year = Number(match[2]);
    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
}

export const AddCardModal = ({ metodoPagoId, onClose, onCreated }: AddCardModalProps) => {
    const { session } = useAuth();

    const [alias, setAlias] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cardDigits = useMemo(() => onlyDigits(cardNumber), [cardNumber]);
    const brand = useMemo(() => detectBrand(cardDigits), [cardDigits]);
    const last4 = cardDigits.slice(-4);

    const hasData = Boolean(
        alias.trim() || cardDigits || onlyDigits(expiry) || cvc
    );

    const handleClose = () => {
        if (hasData && !loading) {
            const shouldClose = window.confirm(
                "¿Estás seguro de que quieres salir y perder tu progreso?"
            );
            if (shouldClose) onClose();
        } else {
            onClose();
        }
    };

    const handleCardNumberChange = (value: string) => {
        const digits = onlyDigits(value).slice(0, 16);
        setCardNumber(formatCardNumber(digits));
    };

    const handleExpiryChange = (value: string) => {
        setExpiry(formatExpiry(onlyDigits(value)));
    };

    const handleCvcChange = (value: string) => {
        setCvc(onlyDigits(value).slice(0, 4));
    };

    const validate = (): string | null => {
        if (cardDigits.length < 13 || cardDigits.length > 16) {
            return "El número de tarjeta debe tener entre 13 y 16 dígitos";
        }
        if (!isValidLuhn(cardDigits)) {
            return "El número de tarjeta no es válido";
        }
        if (brand === "unknown") {
            return "Solo se admiten tarjetas Visa o Mastercard";
        }
        if (!isValidExpiry(expiry)) {
            return "La fecha de vencimiento no es válida (MM/AA)";
        }
        if (cvc.length < 3 || cvc.length > 4) {
            return "El CVC debe tener 3 o 4 dígitos";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Only last 4, alias and brand are sent to the backend.
            // Full number, expiry and CVC stay on the client for form validation.
            const card = await createCard(session!.access_token, {
                metodo_pago_id: metodoPagoId,
                ultimos_4: last4,
                alias: alias.trim() || undefined,
                marca: brand,
            });
            onCreated(card);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar tarjeta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Nueva tarjeta</h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition text-gray-500 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Visual card preview */}
                <div className="mb-5 rounded-2xl bg-linear-to-br from-green-700 to-green-500 p-5 text-white shadow-lg shadow-green-600/20">
                    <div className="flex items-center justify-between mb-6">
                        <CreditCard size={28} className="opacity-90" />
                        <span className="text-sm font-semibold tracking-wide uppercase">
                            {BRAND_LABELS[brand]}
                        </span>
                    </div>
                    <p className="font-mono text-lg tracking-widest mb-4">
                        {cardNumber || "•••• •••• •••• ••••"}
                    </p>
                    <div className="flex items-end justify-between gap-4 text-xs">
                        <div className="min-w-0">
                            <p className="text-green-100 uppercase tracking-wide mb-0.5">Alias</p>
                            <p className="font-medium truncate">{alias.trim() || "—"}</p>
                        </div>
                        <div>
                            <p className="text-green-100 uppercase tracking-wide mb-0.5">Vence</p>
                            <p className="font-medium font-mono">{expiry || "MM/AA"}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Alias
                        </label>
                        <input
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ej: Visa personal"
                            autoComplete="cc-name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Número de tarjeta *
                        </label>
                        <input
                            value={cardNumber}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="4242 4242 4242 4242"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            maxLength={19}
                        />
                        <p className="mt-1 text-xs text-gray-400">
                            Solo se guardan los últimos 4 dígitos y la marca
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Vencimiento *
                            </label>
                            <input
                                value={expiry}
                                onChange={(e) => handleExpiryChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="MM/AA"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                maxLength={5}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVC *
                            </label>
                            <input
                                value={cvc}
                                onChange={(e) => handleCvcChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="123"
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                maxLength={4}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin mx-auto" />
                            ) : (
                                "Guardar"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
