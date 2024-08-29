import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Signup Controller
const registerController = async (req, res) => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });

    const savedUser = await newUser.save();
    res.status(200).send(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json("Wrong Credentials");
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json("Wrong Credentials");
    }

    const accessToken = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      _id: user._id,
      username: user.username,
      token: accessToken,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

// logoutController
const logoutController = async (req, res) => {
  res.clearCookie("access_token").status(200).json("Logged out successfully");
};

export { registerController, loginController, logoutController };
