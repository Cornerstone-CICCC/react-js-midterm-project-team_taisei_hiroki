import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { totalCount } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-brand-600" : "text-slate-600 hover:text-slate-900"
    }`;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-semibold text-lg text-slate-900">Shoply</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin" className={navLinkClass}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/cart"
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100"
              aria-label="Cart"
            >
              <CartIcon />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  Hi, <span className="font-medium text-slate-900">{user.name}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <MenuIcon open={open} />
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-2">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className="block px-2 py-2 rounded hover:bg-slate-100"
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              onClick={() => setOpen(false)}
              className="block px-2 py-2 rounded hover:bg-slate-100"
            >
              Products
            </NavLink>
            <NavLink
              to="/cart"
              onClick={() => setOpen(false)}
              className="block px-2 py-2 rounded hover:bg-slate-100"
            >
              Cart ({totalCount})
            </NavLink>
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                onClick={() => setOpen(false)}
                className="block px-2 py-2 rounded hover:bg-slate-100"
              >
                Admin
              </NavLink>
            )}
            <div className="pt-2 border-t border-slate-200 flex gap-2">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary w-full">
                  Logout ({user.name})
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="btn-secondary flex-1"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="btn-primary flex-1"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5 text-slate-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13l-1.6-8M7 13l-2.3 5.2A1 1 0 005.6 20H19M10 21a1 1 0 11-2 0 1 1 0 012 0zm9 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="w-6 h-6 text-slate-700"
    >
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}
