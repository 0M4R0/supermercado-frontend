import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Package } from "lucide-react";
import { fetchCategorias } from "../../api/productos";
import type { Category } from "../../types/product";
import { CATEGORY_IMAGES } from "../../types/api";

function getCategoryImage(nombre: string): string | undefined {
  const url = CATEGORY_IMAGES[nombre];
  return typeof url === "string" && url.length > 0 ? url : undefined;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategorias();
        setCategories(data);
      } catch {
        setError("No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
        Nuestras Categorías
      </h2>
      <p className="text-sm font-bold text-gray-600 text-center mb-10">
        Organiza tu compra por secciones y ahorra tiempo
      </p>

      {loading ? (
        <div className="flex justify-center py-5">
          <Loader2 size={28} className="animate-spin text-gray-400" />
        </div>
      ) : error ? (
        <p className="text-center text-red-600 text-sm">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500 text-sm">
          No hay categorías disponibles
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-5 justify-items-center">
          {categories.map((category) => {
            const imageUrl = getCategoryImage(category.nombre);

            return (
              <li key={category.id} className="w-full">
                <Link
                  to={`/catalogo?categoria_id=${category.id}`}
                  className="group flex flex-col items-center gap-3 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 rounded-xl"
                >
                  <div className="w-15 h-15 md:w-20 md:h-20 rounded-full border-[3px] border-green-600 bg-green-50 overflow-hidden flex items-center justify-center shadow-sm group-hover:border-green-700 group-hover:shadow-md group-hover:scale-[1.03] transition-all">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={category.nombre}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Package
                        size={32}
                        className="text-green-600/70 group-hover:text-green-700 transition-colors"
                        aria-hidden
                      />
                    )}
                  </div>
                  <span className="text-sm md:text-base font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
                    {category.nombre}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
