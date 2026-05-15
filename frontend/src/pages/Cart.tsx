import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";

export default function Cart() {
  const { items, updateQuantity, removeItem, clear } = useCart();
  const { getById } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const lines = items
    .map((it) => {
      const product = getById(it.productId);
      return product ? { product, quantity: it.quantity } : null;
    })
    .filter((x): x is { product: NonNullable<ReturnType<typeof getById>>; quantity: number } => x !== null);

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Your cart is empty</h1>
        <p className="text-slate-600 mt-2">
          Browse the catalog and add a few things you like.
        </p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          Shop products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Your cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-3">
          {lines.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="card p-4 flex gap-4 items-center"
            >
              <Link
                to={`/products/${product.id}`}
                className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${product.id}`}
                  className="font-medium text-slate-900 hover:text-brand-600 line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-sm font-medium text-slate-900 mt-1 sm:hidden">
                  {formatPrice(product.price)}
                </p>
              </div>
              <div className="hidden sm:block w-24 text-right">
                {formatPrice(product.price)}
              </div>
              <div className="inline-flex items-center border border-slate-300 rounded-lg">
                <button
                  className="px-2 py-1 text-slate-600 hover:text-slate-900"
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="px-3 py-1 min-w-[2rem] text-center text-sm">
                  {quantity}
                </span>
                <button
                  className="px-2 py-1 text-slate-600 hover:text-slate-900"
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="text-slate-400 hover:text-red-600 p-1"
                aria-label="Remove"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={clear}
            className="text-sm text-slate-500 hover:text-red-600 underline mt-2"
          >
            Clear cart
          </button>
        </div>

        <aside className="card p-6 h-fit sticky top-20">
          <h2 className="font-semibold text-slate-900 text-lg mb-4">Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Shipping</dt>
              <dd className="font-medium">
                {shipping === 0 ? "Free" : formatPrice(shipping)}
              </dd>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-semibold">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button
            onClick={handleCheckout}
            className="btn-primary w-full mt-6 !py-3"
          >
            {user ? "Checkout" : "Sign in to checkout"}
          </button>
          <Link
            to="/products"
            className="block text-center text-sm text-slate-600 hover:text-slate-900 mt-3"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
