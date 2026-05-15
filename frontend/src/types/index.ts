export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin";
};
