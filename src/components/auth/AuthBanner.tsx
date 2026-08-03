export default function AuthBanner() {
  return (
    <>
      <img
        src="https://centrocuestanacional.com/wp-content/uploads/2022/01/Supermercados-Nacional-Plaza-Central.jpg"
        alt="Supermarket"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full text-white px-8">
        <h1 className="text-5xl font-bold mb-4">Mercado Verde</h1>

        <p className="text-xl text-center max-w-md">
          Productos frescos, entregados con cuidado directo a tu puerta.
        </p>
      </div>
    </>
  );
}
