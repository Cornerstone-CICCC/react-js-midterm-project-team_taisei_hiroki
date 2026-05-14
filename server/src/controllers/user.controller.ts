import { Request, Response } from "express";
import userModel from "../models/user.model";
import zxcvbn from "zxcvbn";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema";
import { User } from "../generated/prisma/client";
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

// get all users
const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await userModel.fetchAll();
    const publicUsers = users.map((user) => {
      return {
        userName: user.userName,
        role: user.role,
      };
    });
    res.status(200).json(publicUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

// user signup for customer
const signup = async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues });
    return;
  }
  const { userName, email, password } = parsed.data;

  const passwordScore = zxcvbn(password).score;
  if (passwordScore <= 1) {
    res.status(400).json({ message: "Password is too weak" });
    return;
  }
  try {
    const newUser: User | null = await userModel.add({
      userName,
      email,
      password,
    });
    if (!newUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const { password: _password, email: _email, ...publicUser } = newUser;
    res.status(201).json(publicUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// user signup for admin
const signupAdmin = async (req: Request, res: Response) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues });
    return;
  }
  const { userName, email, password } = parsed.data;

  const passwordScore = zxcvbn(password).score;
  if (passwordScore <= 1) {
    res.status(400).json({ message: "Password is too weak" });
    return;
  }

  try {
    const newUser: User | null = await userModel.addAdmin({
      userName,
      email,
      password,
    });
    if (!newUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const { password: _password, ...publicUser } = newUser;
    res.status(201).json(publicUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// user login
const login = async (req: Request, res: Response) => {
  const parsed = loginUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues });
    return;
  }
  const { email, password } = parsed.data;
  try {
    const loginUser: User | null = await userModel.authCheck({
      email,
      password,
    });
    if (!loginUser) {
      res.status(400).json({ message: "Failed to login" });
      return;
    }

    const payload = {
      userId: loginUser.id,
      role: loginUser.role,
    };

    const secretKey: Secret = process.env.JWT_SECRET as Secret;
    const expiresIn: SignOptions["expiresIn"] = process.env
      .JWT_EXPIRES_IN as SignOptions["expiresIn"];

    const token = jwt.sign(payload, secretKey, {
      expiresIn: expiresIn,
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    const { password: _password, email: _email, ...publicUser } = loginUser;
    res.status(200).json(publicUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

const getUserByCookie = async (req: Request, res: Response) => {
  try {
    if (req.user?.userId) {
      const { userId } = req.user;
      const user: User | null = await userModel.fetchUser(userId);
      if (!user) {
        res.status(401).json({ message: "User is not authorized" });
        return;
      }
      const { password: _password, email: _email, ...publicUser } = user;
      res.status(200).json(publicUser);
    } else {
      res.status(401).json({ message: "User is not authorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export default {
  getAllUser,
  signup,
  signupAdmin,
  login,
  getUserByCookie,
  logout,
};
