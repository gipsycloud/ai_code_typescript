import "dotenv/config";
import express from "express";
import { productsRouter} from "./routes/products";
import { tr } from "zod/v4/locales/index.js";
import { authRouter} from "./routes/auth";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

app.get("/health", (_req, res) => res.json({ ok: true}));
app.use("/api/products", productsRouter);

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log("server is running ${port}"));