import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { formatPrice } from "../lib/format";

export default function Checkout() {
  const { items, clear } = useCart();
  const { getById } = useProducts();
  const { user } = useAuth();

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

  const [submitted, setSubmitted] = useState(false);

  if (lines.length === 0 && !submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Nothing to check out</h1>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          Shop products
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Order placed!</h1>
        <p className="text-slate-600 mt-2">
          Thanks {user?.name}. A confirmation will be sent to {user?.email}.
        </p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          Keep shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clear();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Shipping address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full name</label>
                <input required defaultValue={user?.name ?? ""} className="input" />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  required
                  type="email"
                  defaultValue={user?.email ?? ""}
                  className="input"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Street address</label>
                <input required className="input" />
              </div>
              <div>
                <label className="label">City</label>
                <input required className="input" />
              </div>
              <div>
                <label className="label">Postal code</label>
                <input required className="input" />
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="font-semibold text-slate-900 mb-2">Payment</h2>
            <p className="text-sm text-slate-500 mb-4">
              Demo only — no real payment is processed.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">Card number</label>
                <input required placeholder="4242 4242 4242 4242" className="input" />
              </div>
              <div>
                <label className="label">Expiry</label>
                <input required placeholder="MM/YY" className="input" />
              </div>
              <div>
                <label className="label">CVC</label>
                <input required placeholder="123" className="input" />
              </div>
            </div>
          </div>
        </div>

        <aside className="card p-6 h-fit">
          <h2 className="font-semibold text-slate-900 mb-4">Order</h2>
          <ul className="space-y-3 text-sm mb-4">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between">
                <span className="text-slate-700">
                  {product.name} <span className="text-slate-400">× {quantity}</span>
                </span>
                <span className="font-medium">
                  {formatPrice(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-2 text-sm border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <dt className="text-slate-600">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold border-t border-slate-200 pt-2 mt-2">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn-primary w-full mt-6 !py-3">
            Place order
          </button>
        </aside>
      </form>
    </div>
  );
}
