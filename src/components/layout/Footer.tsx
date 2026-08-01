import { Store } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-auto bg-white border-t border-gray-200">
            <section className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap justify-between gap-8">
                {/* First Column */}
                <div className="w-64">
                    <Link
                        to="/home"
                        className="flex items-center gap-2 font-bold text-gray-900 text-sm"
                    >
                        <Store size={20} className="text-green-600" />
                        <span>Supermercado</span>
                    </Link>
                    <p className="mt-2 text-sm text-gray-600">
                        Tu supermercado online de confianza. Productos frescos, entrega rápida.
                    </p>
                </div>

                {/* Second Column */}
                <div className="w-40">
                    <h3 className="font-semibold text-gray-900 mb-3">Navegación</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><Link to="/home" className="hover:text-green-600 transition">Home</Link></li>
                        <li><Link to="/catalogo" className="hover:text-green-600 transition">Catálogo</Link></li>
                        <li><Link to="/cuenta/pedidos" className="hover:text-green-600 transition">Pedidos</Link></li>
                    </ul>
                </div>

                {/* Third Column */}
                <div className="w-48">
                    <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li>Términos de uso</li>
                        <li>Política de privacidad</li>
                        <li>Política de cookies</li>
                        <li>Aviso legal</li>
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
