import type { Pedido } from "../../types/checkout";
import { formatPrice } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import { ChevronRight } from "lucide-react";

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

export const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <div className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md hover:border-green-200 transition-all min-w-0">
      <div className="flex items-center gap-4 min-w-0">
        {/* Images */}
        {order.imagenes_productos && order.imagenes_productos.length > 0 && (
          <div className="hidden sm:flex -space-x-3 shrink-0">
            {order.imagenes_productos.slice(0, 3).map((img, index) => (
              <img
                key={index}
                fetchPriority="high"
                src={img}
                alt={`Product ${index + 1}`}
                className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm" />
            ))}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
            <p className="font-semibold text-gray-900 break-all text-sm sm:text-base">
              {order.codigo_seguimiento}
            </p>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                estadoColors[order.estado] ?? "text-gray-600 bg-gray-100"
              }`}
            >
              {order.estado}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{formatDate(order.fecha_pedido)}</p>

          {order.resumen_productos && (
            <p className="text-sm text-gray-400 mt-1 truncate">
              {order.resumen_productos}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:pl-2">
        <p className="font-bold text-base sm:text-lg text-gray-900">
          {formatPrice(order.total)}
        </p>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-green-600 transition-colors shrink-0" />
      </div>
    </div>
  );
};
