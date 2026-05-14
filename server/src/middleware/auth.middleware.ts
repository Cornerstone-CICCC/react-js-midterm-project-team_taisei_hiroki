import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const TOKEN_SECRET = process.env.JWT_SECRET;
  if (!TOKEN_SECRET) {
    res.status(500).json({ message: "Unable to verify token" });
    return;
  }
  const { token } = req.cookies;
  if (!token) {
    res.status(401).send("Your are not logged in");
    return;
  }
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    if (typeof decoded === "string") {
      res.status(401).json({ message: "You are not logged in" });
      return;
    }
    if (decoded.userId && decoded.role) {
      req.user = { userId: decoded.userId, role: decoded.role };
      next();
    } else {
      res.status(401).json({ message: "You are not logged in" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Missing access token" });
  }
};
