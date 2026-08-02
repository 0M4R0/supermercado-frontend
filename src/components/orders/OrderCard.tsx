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
    <div className="group flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-green-200 transition-all">
      <div className="flex items-center gap-5">
        {/* Images */}
        {order.imagenes_productos && order.imagenes_productos.length > 0 && (
          <div className="hidden sm:flex -space-x-3">
            {order.imagenes_productos.slice(0, 3).map((img, index) => (
              <img key={index} src={img} alt={`Product ${index + 1}`} className="w-12 h-12 object-cover rounded-full border-2 border-white shadow-sm" />
            ))}
          </div>
        )}

        <div>
          <div className="flex items-center flex-wrap gap-2">
            <p className="font-semibold text-gray-900">
              {order.codigo_seguimiento}
            </p>
            <span
              className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                estadoColors[order.estado] ?? "text-gray-600 bg-gray-100"
              }`}
            >
              {order.estado}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{formatDate(order.fecha_pedido)}</p>

          {order.resumen_productos && (
            <p className="text-sm text-gray-400 mt-1 truncate max-w-xs">
              {order.resumen_productos}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="font-bold text-lg text-gray-900">{formatPrice(order.total)}</p>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-green-600 transition-colors" />
      </div>
    </div>
  );
};
