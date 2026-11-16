
import "dotenv/config";

import express from "express";
import cors from "cors";

import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import { db } from "./config/firebaseAdmin.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server requests and configured frontend origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
  })
);

app.use(express.json({ limit: "20kb" }));

// Existing product API
app.use("/api/products", productRoutes);

// New Bloom AI API
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bloom & Bliss Backend Running!"
  });
});

app.get("/api/ai/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bloom AI API is reachable"
  });
});

// Existing Firebase test
app.get("/test-firebase", async (req, res) => {
  try {
    await db.collection("products").limit(1).get();

    res.json({
      success: true,
      message: "Firebase Admin Connected Successfully!",
    });
  } catch (error) {
    console.error("Firebase error:", error);

    res.status(500).json({
      success: false,
      message: "Firebase connection failed",
    });
  }
});

// Local development server.
// Vercel imports the app without calling listen().
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `Bloom & Bliss server running on port ${PORT}`
    );
  });
}

export default app;
