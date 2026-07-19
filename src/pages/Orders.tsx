import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { UseAuth } from "../context/AuthContext";
import { fetchPedidos } from "../api/pedidos";
import type { Pedido } from "../types/checkout";

const estadoColors: Record<string, string> = {
    Pendiente: "text-yellow-600 bg-yellow-50",
    Confirmado: "text-blue-600 bg-blue-50",
    Enviado: "text-purple-600 bg-purple-50",
    Entregado: "text-green-600 bg-green-50",
    Cancelado: "text-red-600 bg-red-50",
};

export const Orders = () => {
    const { session } = UseAuth();
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!session) return;
            setLoading(true);
            try {
                const data = await fetchPedidos(session.access_token);
                setOrders(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al cargar pedidos");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [session]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(value);
    };

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
                    <p className="text-gray-600">Visualiza y gestiona todos tus pedidos</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-gray-400" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Package size={32} className="text-gray-400" />
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            No tienes pedidos aún
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Cuando realices una compra, aparecerá aquí
                        </p>
                        <Link
                            to="/catalogo"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            Ir al catálogo
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order.pedido_id}
                                className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(order.created_at)}
                                        </p>
                                        <p className="font-semibold text-gray-900 mt-0.5">
                                            {order.codigo_seguimiento}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-900">
                                            {formatPrice(order.total)}
                                        </p>
                                        <span
                                            className={`inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                                                estadoColors[order.estado_pedido] ?? "text-gray-600 bg-gray-100"
                                            }`}
                                        >
                                            {order.estado_pedido}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Orders;
