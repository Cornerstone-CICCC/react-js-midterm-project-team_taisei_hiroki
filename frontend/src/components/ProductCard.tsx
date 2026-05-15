import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="card overflow-hidden group flex flex-col">
      <Link to={`/products/${product.id}`} className="block aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link
          to={`/products/${product.id}`}
          className="font-medium text-slate-900 hover:text-brand-600 line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-semibold text-slate-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => addItem(product.id)}
            className="btn-primary !py-1.5 !px-3 text-xs"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
