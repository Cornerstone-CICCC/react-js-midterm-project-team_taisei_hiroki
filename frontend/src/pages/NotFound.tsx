import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-4xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">
        We couldn't find the page you were looking for.
      </p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Back home
      </Link>
    </div>
  );
}
