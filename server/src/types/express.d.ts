type AuthUser = {
  userId: number;
  role: "admin" | "customer";
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
