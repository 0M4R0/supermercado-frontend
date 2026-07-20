import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { UseAuth } from "../context/AuthContext";
import { fetchPedidos } from "../api/pedidos";
import { OrderCard } from "../components/OrderCard";
import type { Pedido } from "../types/checkout";

const PAGE_SIZE = 10;

export const Orders = () => {
    const { session } = UseAuth();
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!session) return;
            setLoading(true);
            try {
                const data = await fetchPedidos(session.access_token, page, PAGE_SIZE);
                setOrders(data.data);
                setTotalPages(data.total_pages);
            } catch {
                setError("Error al cargar pedidos");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [session, page]);

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
                            <OrderCard key={order.pedido_id} order={order} />
                        ))}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <span className="text-sm text-gray-600">
                                    Página {page} de {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Orders;
