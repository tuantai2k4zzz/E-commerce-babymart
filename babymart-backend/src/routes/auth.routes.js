// src/routes/auth.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const router = express.Router();

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });
    
    const user = await User.create({ firstName, lastName, email, password });
    const token = createToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Register failed" } );
    console.error(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = createToken(user);
    res.json({ user, token });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  // optional: dùng protect nếu muốn
  res.json({ message: "Implement later if cần" });
});

export default router;
