import express from "express";
import { loginController, registerController } from "../controllers/User.js";
const router = express.Router();

// Login and Signup Routes

router.post("/register", registerController);
router.post("/login", loginController);

export default router;
