import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCartIcon } from "lucide-react";
import { ApiError } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { UseAuth } from "../../context/AuthContext";
import type { Product } from "../../types/product";
import { formatPrice } from "../../utils/formatPrice";
import { useUI } from "../../context/UIContext";

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const { session } = UseAuth();
  const { addToCart } = useCart();
  const { openOverlay } = useUI();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setError("");
    setAdding(true);

    try {
      if (!session) {
        navigate("/login");
        return;
      }

      // ADD TO CART
      await addToCart(Number(product.id), 1);

      // OPEN CART OVERLAY
      openOverlay("cart");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/login");
        return;
      }
      setError("No se pudo agregar al carrito");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="group relative flex flex-col bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 hover:border-green-200 transition-all duration-300">
      <Link to={`/catalogo/${product.id}`} className="block">
        <div className="relative bg-gray-100 h-48 flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover object-top h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="text-gray-400 text-sm">Imagen no disponible</div>
          )}

          {product.discount ? (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold uppercase px-2.5 py-1 rounded-full shadow-sm">
              {product.discount}
            </span>
          ) : null}
        </div>
      </Link>

      <div className="flex-1 flex flex-col p-4 space-y-3">
        {product.categories?.length ? (
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.categories[0].nombre}
          </p>
        ) : (
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Sin categoría
          </p>
        )}

        <Link to={`/catalogo/${product.id}`} className="flex-1">
          <h3 className="text-lg line-clamp-1 font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </Link>
        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding || product.inStock === false}
          className="mt-2 cursor-pointer inline-flex items-center justify-center w-full rounded-full bg-green-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:bg-green-700 transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
        >
          <ShoppingCartIcon className="w-4 h-4 mr-2" />
          {adding ? "Agregando..." : "Añadir"}
        </button>
      </div>
    </article>
  );
};
