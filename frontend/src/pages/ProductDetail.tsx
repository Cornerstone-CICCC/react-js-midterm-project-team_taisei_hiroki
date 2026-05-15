import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/format";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { getById, loading } = useProducts();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const product = id ? getById(id) : undefined;
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
        <p className="text-slate-600 mt-2">
          The product you're looking for doesn't exist or was removed.
        </p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          Back to products
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addItem(product.id, quantity);
    navigate("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-slate-900">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-slate-900">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="card overflow-hidden aspect-square bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-slate-900">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 text-slate-600 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm text-slate-600">Quantity</span>
            <div className="inline-flex items-center border border-slate-300 rounded-lg">
              <button
                className="px-3 py-2 text-slate-600 hover:text-slate-900 disabled:opacity-50"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <button
                className="px-3 py-2 text-slate-600 hover:text-slate-900"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleAdd}
              className="btn-primary !px-6 !py-3 flex-1 sm:flex-none"
            >
              Add to cart
            </button>
            <Link to="/products" className="btn-secondary !px-6 !py-3">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
