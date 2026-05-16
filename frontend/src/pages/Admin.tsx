import { useState } from "react";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/format";
import type { Product } from "../types";

type Draft = Omit<Product, "id">;

const emptyDraft: Draft = {
  name: "",
  description: "",
  price: 0,
  image: "",
};

export default function Admin() {
  const { products, loading, error, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    const { id: _id, ...rest } = p;
    void _id;
    setDraft(rest);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setDraft(emptyDraft);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, draft);
      } else {
        await addProduct(draft);
      }
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin dashboard</h1>
          <p className="text-slate-600 mt-1">
            Manage your store catalog.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          + New product
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <StatCard label="Total products" value={products.length} />
        <StatCard
          label="Catalog value"
          value={formatPrice(
            products.reduce((sum, p) => sum + p.price, 0)
          )}
        />
      </div>

      {error && (
        <div className="card p-4 mb-4 text-red-600 text-sm">{error}</div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-600">Product</th>
                <th className="px-4 py-3 font-medium text-slate-600">Price</th>
                <th className="px-4 py-3 font-medium text-slate-600 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover bg-slate-100"
                      />
                      <span className="font-medium text-slate-900 line-clamp-1">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    No products yet.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 flex items-center justify-center p-4"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? "Edit product" : "New product"}
              </h2>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 border border-red-200">
                  {formError}
                </div>
              )}
              <div>
                <label className="label">Name</label>
                <input
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  required
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Price (USD)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    step="1"
                    value={draft.price}
                    onChange={(e) =>
                      setDraft({ ...draft, price: Number(e.target.value) })
                    }
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Image URL</label>
                  <input
                    required
                    type="url"
                    value={draft.image}
                    onChange={(e) => setDraft({ ...draft, image: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeForm} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {submitting ? "Saving…" : editingId ? "Save changes" : "Create product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
