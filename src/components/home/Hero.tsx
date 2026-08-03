import { ArrowRight, Truck } from "lucide-react";

export default function Hero({ onExplore }: { onExplore: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16 pt-15">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 order-2 min-[770px]:order-1">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Tu supermercado,
            <br />
            <span className="text-green-600">a un click</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-md">
            Productos frescos de calidad, entregados en menos de dos horas. Sin
            complicaciones.
          </p>
          <div className="flex items-center gap-3 mx-auto w-fit">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/25 active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Explorar productos <ArrowRight size={17} />
            </button>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-4/3 order-1 md:order-2 shadow-xl">
          <img
            fetchPriority="high"
            src="https://vjkxoqxiwwkyajjrsmyi.supabase.co/storage/v1/object/public/productos-img/market.png"
            alt="Productos frescos del mercado"
            className="object-cover absolute inset-0 w-full h-full"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
          <DeliveryInfo />
        </div>
      </div>
    </section>
  );
}

function DeliveryInfo() {
  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3.5 flex items-center gap-3 shadow-lg">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <Truck size={17} className="text-green-600" />
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-900">
          Entrega hoy disponible
        </p>
        <p className="text-xs text-gray-600">Pedidos antes de las 20:00</p>
      </div>
    </div>
  );
}
