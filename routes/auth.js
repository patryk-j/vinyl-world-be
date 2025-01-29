import { Router } from "express";
import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";
import User from "../models/user.js";
import RefreshTokens from "../models/refreshTokens.js";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  try {
    const newPassword = await bcrypt.hash(password, 10);
    await User.create({
      name: name,
      email: email,
      password: newPassword,
      isAdmin: isAdmin || false,
    });
    const accessToken = jwt.sign(
      { email: email, isAdmin: isAdmin || false, name: name },
      process.env.TOKEN_SECRET
    );
    res.status(200).json({
      message: "User successfully created.",
      user: {
        token: accessToken,
        name: name,
        email: email,
        isAdmin: isAdmin || false,
      },
    });
  } catch (error) {
    res.status(403).json({ message: "User with this email already exists." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(403)
      .json({ message: "User with this email does not exist." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (isPasswordValid) {
    const accessToken = jwt.sign(
      { email: email, isAdmin: user.isAdmin, name: user.name },
      process.env.TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { email: email, name: user.name },
      process.env.REFRESH_TOKEN_SECRET
    );
    try {
      await RefreshTokens.create({ refreshToken: refreshToken });
    } catch (error) {
      console.log(error);
    }
    res.cookie("token", accessToken, {
      httpOnly: true,
    });
    return res.json({
      message: "User successfully logged in.",
      token: accessToken,

      status: 200,
      user: {
        email: email,
        name: user.name,
      },
    });
  }
  return res.status(403).json({ message: "Password is invalid." });
});

export default router;
