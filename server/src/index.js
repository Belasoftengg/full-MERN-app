import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// CORS for React app (send cookies)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  })
);

// Health
app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Optional: serve static Level 1 frontend if you want (comment out if not needed)
// const publicDir = path.resolve(__dirname, "../../frontend-basic");
// app.use(express.static(publicDir));
// app.get("/", (req, res) => res.sendFile(path.join(publicDir, "index.html")));

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start
(async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
})();
