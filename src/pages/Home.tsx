import { Link } from "react-router-dom";

export default function Home() {
    return (
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 text-center">
            <h1 className="text-3xl font-semibold">Bienvenido al supermercado</h1>
            <p className="mt-4 text-base text-slate-600">Selecciona una opción para navegar por la aplicación.</p>

            <div className="flex gap-4 justify-center mt-6">
                <Link to="/catalogo" className="text-blue-500 hover:underline">Catálogo</Link>
            </div>
        </main>
    );
}
