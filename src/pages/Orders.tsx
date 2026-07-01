import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { UseAuth } from "../context/AuthContext";

export const Orders = () => {
    const { } = UseAuth();
    const orders: any[] = []; // Aquí irá la lógica para traer pedidos

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
                    <p className="text-gray-600">Visualiza y gestiona todos tus pedidos</p>
                </div>

                {/* Orders list or empty state */}
                {orders.length === 0 ? (
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
                        {orders.map((order: any, idx: number) => (
                            <div
                                key={idx}
                                className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            Pedido #{order.id}
                                        </h3>
                                        <p className="text-sm text-gray-600">{order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${order.total}
                                        </p>
                                        <p className="text-sm text-gray-600">{order.status}</p>
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
