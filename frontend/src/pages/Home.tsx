import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products } = useProducts();
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-50 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium">
              New collection · Spring 2026
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
              Things you'll love,<br />
              <span className="text-brand-600">curated for you.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg">
              A small shop for thoughtful products — tech, home, and accessories
              picked for quality and everyday joy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary !px-6 !py-3 text-base">
                Shop products
              </Link>
              <Link to="/signup" className="btn-secondary !px-6 !py-3 text-base">
                Create account
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"
                alt="Shopping bag and accessories"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg p-4 border border-slate-200 w-48">
              <p className="text-xs text-slate-500">Free shipping</p>
              <p className="text-sm font-semibold text-slate-900">On orders over $50</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Featured products
            </h2>
            <p className="text-slate-600 mt-1">A few favorites from the catalog.</p>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { title: "Free shipping", body: "On all orders over $50." },
            { title: "Easy returns", body: "30-day no-questions returns." },
            { title: "Secure checkout", body: "Encrypted, Stripe-ready payments." },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
