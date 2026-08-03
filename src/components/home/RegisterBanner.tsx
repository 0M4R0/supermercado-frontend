export default function RegisterBanner({ onSignup }: { onSignup: () => void }) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16">
        <div className="bg-linear-to-r from-green-600 to-green-500 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-green-600/25">
          <div className="text-white text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Crea una cuenta gratis</h2>
            <p className="text-green-100">Accede a ofertas especiales y descuentos exclusivos</p>
          </div>
          <div>
            <button
              type="button"
              className="text-green-600 font-bold cursor-pointer bg-white px-7 py-3.5 rounded-xl shadow-lg hover:bg-green-50 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600"
              onClick={onSignup}
            >
              Registrarse
            </button>
          </div>
        </div>
    </section>
  );
}
