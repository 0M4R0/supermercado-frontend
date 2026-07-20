import type { Pedido } from "../types/checkout";
import { formatPrice } from "../utils/formatPrice";

type OrderCardProps = {
    order: Pedido;
};

const estadoColors: Record<string, string> = {
    Pendiente: "text-yellow-600 bg-yellow-50",
    Confirmado: "text-blue-600 bg-blue-50",
    Enviado: "text-purple-600 bg-purple-50",
    Entregado: "text-green-600 bg-green-50",
    Cancelado: "text-red-600 bg-red-50",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export const OrderCard = ({ order }: OrderCardProps) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                    <div className="flex items-center">
                        <p className="font-semibold text-gray-900 mt-0.5 mr-3">
                            {order.codigo_seguimiento}
                        </p>
                        <span
                            className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                estadoColors[order.estado] ?? "text-gray-600 bg-gray-100"
                            }`}
                        >
                            {order.estado}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.fecha_pedido)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {order.resumen_productos ? order.resumen_productos : ""}
                        {order.cantidad_productos > 1 ? ` +${order.cantidad_productos - 1} más` : ""}
                    </p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</p>
                </div>
            </div>
        </div>
    );
};
