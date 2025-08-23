import { Router } from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth /* , requireRole */ } from "../middleware/auth.js";

const router = Router();

// Public READ (optional). If you want all protected, wrap with requireAuth.
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const items = await Product.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json(items);
  })
);
// Protected: create
router.post(
  "/",
  requireAuth,
  [body("name").isString().isLength({ min: 2 }), body("price").isFloat({ min: 0 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, price } = req.body;
    const product = await Product.create({ name: name.trim(), price, owner: req.user.id });
    res.status(201).json(product);
  })
);

// Get one
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Product not found" });
    res.json(item);
  })
);

// Update (owner-only OR admin)
router.put(
  "/:id",
  requireAuth,
  [body("name").optional().isString().isLength({ min: 2 }), body("price").optional().isFloat({ min: 0 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Product not found" });

    const isOwner = item.owner.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    if (typeof req.body.name === "string") item.name = req.body.name.trim();
    if (typeof req.body.price !== "undefined") item.price = req.body.price;

    await item.save();
    res.json(item);
  })
);

// Delete (owner-only OR admin)
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Product not found" });

    const isOwner = item.owner.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ error: "Forbidden" });

    await item.deleteOne();
    res.status(204).send();
  })
);

export default router;
