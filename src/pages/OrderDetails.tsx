import { useNavigate, useParams } from "react-router-dom";
import { fetchPedido } from "../api/pedidos";
import { type PedidoDetail } from "../types/checkout";

import { useEffect, useState } from "react";
import { UseAuth } from "../context/AuthContext";
import { ChevronLeft, CreditCard, MapPin } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";

const OrderDetails = () => {
  const { id: codigoSeguimiento } = useParams<{ id: string }>();
  const { session } = UseAuth();
  const navigate = useNavigate();
  const token = session?.access_token;

  const [pedido, setPedido] = useState<PedidoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const ESTADO_BADGE: Record<string, string> = {
    Pendiente: "bg-gray-100 text-gray-700",
    "En preparación": "bg-amber-100 text-amber-700",
    "En camino": "bg-purple-100 text-purple-700",
    Entregado: "bg-green-100 text-green-700",
    Cancelado: "bg-red-100 text-red-700",
    Devuelto: "bg-orange-100 text-orange-700",
  };

  useEffect(() => {
    const load = async () => {
      if (!token || !codigoSeguimiento) return;

      setLoading(true);
      setError("");

      try {
        const data = await fetchPedido(token, codigoSeguimiento);
        setPedido(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error al cargar el pedido");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, codigoSeguimiento]);

  if (loading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        <main className="flex-1 pt-24 pb-12">
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }
  if (!pedido) return <div>No hay datos disponibles</div>;

  return (
    <main className="flex-1 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-1 text-gray-400 hover:text-gray-700 cursor-pointer"
              aria-label="Volver"
            >
              <ChevronLeft size={25} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {pedido.codigo_seguimiento}
              </h1>
              <p className="text-sm text-gray-500">
                {formatDate(pedido.fecha_pedido)}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${ESTADO_BADGE[pedido.estado] ?? "bg-gray-100 text-gray-700"}`}
          >
            {pedido.estado}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Productos ({pedido.productos.length})
          </h2>
          <div className="space-y-3">
            {pedido.productos.map((p) => (
              <div key={p.producto_id} className="flex items-center gap-3">
                <img
                  src={p.imagen_producto ?? "https://placehold.co/48x48?text=?"}
                  alt={p.nombre}
                  className="w-12 h-12 rounded-md object-cover bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {p.nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    ×{p.cantidad} · {formatPrice(p.precio_unitario)} c/u
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {formatPrice(p.subtotal)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 mt-4 pt-4">
            <span className="font-semibold text-gray-900">Total</span>
            <span className="font-semibold text-green-600">
              {formatPrice(pedido.total)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-5 space-y-4">
          {pedido.entrega && (
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Dirección de entrega</p>
                <p className="text-sm font-medium text-gray-900">
                  {pedido.entrega.direccion} · {pedido.entrega.ciudad}
                </p>
              </div>
            </div>
          )}
          {pedido.pago && (
            <div className="flex items-start gap-3">
              <CreditCard size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Método de pago</p>
                <p className="text-sm font-medium text-gray-900">
                  {pedido.pago.tarjeta
                    ? `${pedido.pago.tarjeta.marca} •••• ${pedido.pago.tarjeta.ultimos_4}`
                    : pedido.pago.metodo_pago}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
