import { Request, Response, NextFunction } from "express";

export const adminCheck = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "You are not authorized" });
    return;
  }
};
