import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, Loader2 } from "lucide-react";
import { UseAuth } from "../context/AuthContext";
import { fetchPedidos } from "../api/pedidos";
import { OrderCard } from "../components/orders/OrderCard";
import type { Pedido } from "../types/checkout";

const PAGE_SIZE = 10;

export const Orders = () => {
    const { session } = UseAuth();
    // Depend on the token string, not the whole session object — Supabase
    // recreates session on tab focus / auth events, which would re-fetch every time.
    const token = session?.access_token;
    const [orders, setOrders] = useState<Pedido[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!token) return;
            setLoading(true);
            setError("");
            try {
                const data = await fetchPedidos(token, page, PAGE_SIZE);
                setOrders(data.data);
                setTotalPages(data.total_pages);
            } catch {
                setError("Error al cargar pedidos");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token, page]);

    return (
        <main className="flex-1 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
                    <p className="text-gray-600">Visualiza y gestiona todos tus pedidos</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={32} className="animate-spin text-green-600" />
                    </div>
                ) : error ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-red-600 bg-red-50 border border-red-100 rounded-lg inline-block px-4 py-2">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 bg-green-50 rounded-full">
                                <Package size={32} className="text-green-500" />
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
                            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-600/25 transition active:scale-[0.98] cursor-pointer"
                        >
                            Ir al catálogo
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-4 gap-2">
                        {orders.map((order) => (
                          <Link key={order.pedido_id} to={`/cuenta/pedidos/${order.codigo_seguimiento}`}>
                            <OrderCard order={order} />
                          </Link>
                        ))}

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    ← Anterior
                                </button>
                                <span className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
                                    Página {page} de {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                                >
                                    Siguiente →
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
