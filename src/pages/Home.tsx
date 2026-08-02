import { useNavigate } from "react-router-dom";
import { ArrowRight, Truck } from "lucide-react";
import { UseAuth } from "../context/AuthContext";

export default function Home() {
  const { session } = UseAuth();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-10 text-center">
      <div>
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16 pt-15">
          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div className="space-y-6 order-2 min-[770px]:order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Tu supermercado,<br />
                <span className="text-green-500">a un click</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
                Productos frescos de calidad, entregados en menos de dos horas. Sin complicaciones.
              </p>
              <div className="flex items-center gap-3 mx-auto w-fit">
                <button onClick={() => navigate("/catalogo")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm cursor-pointer">
                  Explorar productos <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-secondary aspect-4/3 order-1 md:order-2">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop&auto=format"
                alt="Productos frescos del mercado"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/85 rounded-xl p-3 flex items-center gap-3 shadow-lg">
                <div className="w-9 h-9 bg-green-100 dark:bg-green-300 rounded-full flex items-center justify-center">
                  <Truck size={16} className="text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Entrega hoy disponible</p>
                  <p className="text-xs text-muted-foreground">Pedidos antes de las 20:00</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Categories */}

        {/* Register if not logged in */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
          {!session && (
            <div className="bg-green-500 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Crea una cuenta gratis</h2>
                <p className="text-green-100">Accede a ofertas especiales y descuentos exclusivos</p>
              </div>
              <div>
                <button
                  type="button"
                  className="text-green-600 font-bold cursor-pointer bg-white px-6 py-3 rounded-lg"
                  onClick={() => navigate("/signup")}
                >
                  Registrarse
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
