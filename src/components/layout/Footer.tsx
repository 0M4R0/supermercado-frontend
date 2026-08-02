import { Store } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-white border-t border-gray-200">
            <section className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-between gap-8">
                {/* First Column */}
                <div className="w-64">
                    <Link
                        to="/home"
                        className="flex items-center gap-2 font-bold text-gray-900 text-sm"
                    >
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <Store size={18} className="text-green-600" />
                        </div>
                        <span>Supermercado</span>
                    </Link>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                        Tu supermercado online de confianza. Productos frescos, entrega rápida.
                    </p>
                </div>

                {/* Second Column */}
                <div className="w-40">
                    <h3 className="font-semibold text-gray-900 mb-3">Navegación</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link to="/home" className="hover:text-green-600 transition-colors">Home</Link></li>
                        <li><Link to="/catalogo" className="hover:text-green-600 transition-colors">Catálogo</Link></li>
                        <li><Link to="/cuenta/pedidos" className="hover:text-green-600 transition-colors">Pedidos</Link></li>
                    </ul>
                </div>

                {/* Third Column */}
                <div className="w-48">
                    <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="hover:text-gray-900 transition-colors cursor-pointer">Términos de uso</li>
                        <li className="hover:text-gray-900 transition-colors cursor-pointer">Política de privacidad</li>
                        <li className="hover:text-gray-900 transition-colors cursor-pointer">Política de cookies</li>
                        <li className="hover:text-gray-900 transition-colors cursor-pointer">Aviso legal</li>
                    </ul>
                </div>
            </section>

            {/* Footer Bottom */}
            <div className="border-t border-gray-200 py-4 text-center">
                <p className="text-sm text-gray-500">
                    &copy; {year} Supermercado — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
