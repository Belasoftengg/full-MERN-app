import { Router } from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { signToken, sendAuthCookie, clearAuthCookie } from "../utils/tokens.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").isString().isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isString().isLength({ min: 6 })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already registered" });

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    sendAuthCookie(res, token);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  })
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 6 })],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    const token = signToken({ id: user._id }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);
    sendAuthCookie(res, token);

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);

router.post("/logout", asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
}));

export default router;
