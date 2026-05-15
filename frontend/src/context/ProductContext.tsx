import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { request } from "../lib/api";
import type { Product } from "../types";

type ProductInput = Omit<Product, "id">;

type ProductContextValue = {
  products: Product[];
  loading: boolean;
  error: string | null;
  getById: (id: string) => Product | undefined;
  refresh: () => Promise<void>;
  addProduct: (data: ProductInput) => Promise<Product>;
  updateProduct: (id: string, data: Partial<ProductInput>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
};

const ProductContext = createContext<ProductContextValue | null>(null);

type ServerItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

const toProduct = (it: ServerItem): Product => ({
  id: String(it.id),
  name: it.title,
  description: it.description,
  price: it.price,
  image: it.image,
});

const toServerBody = (data: Partial<ProductInput>): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  if (data.name !== undefined) out.title = data.name;
  if (data.description !== undefined) out.description = data.description;
  if (data.price !== undefined) out.price = data.price;
  if (data.image !== undefined) out.image = data.image;
  return out;
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await request<ServerItem[]>("/items");
      setProducts(items.map(toProduct));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getById = (id: string) => products.find((p) => p.id === id);

  const addProduct: ProductContextValue["addProduct"] = async (data) => {
    const created = await request<ServerItem>("/items", {
      method: "POST",
      body: toServerBody(data),
    });
    const product = toProduct(created);
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct: ProductContextValue["updateProduct"] = async (id, data) => {
    const updated = await request<ServerItem>(`/items/${id}`, {
      method: "PATCH",
      body: toServerBody(data),
    });
    const product = toProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)));
  };

  const deleteProduct: ProductContextValue["deleteProduct"] = async (id) => {
    await request(`/items/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{ products, loading, error, getById, refresh, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts(): ProductContextValue {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProducts must be used within ProductProvider");
  return ctx;
}
