
import express from "express";
import { db } from "../config/firebaseAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Unable to fetch products",
    });
  }
});

export default router;
