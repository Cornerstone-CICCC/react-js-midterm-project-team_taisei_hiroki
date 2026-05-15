import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/user.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import itemRouter from "./routes/item.route";
dotenv.config();

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use("/users", userRouter);
app.use("/items", itemRouter);

app.use((req, res) => {
  res.status(404).send("Invalid Page");
});

app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
