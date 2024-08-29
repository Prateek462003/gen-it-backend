import express from "express";
import { generateItineraryController } from "../controllers/Itenerary.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();

// Itenerary Routes
router.post("/generateItenerary", generateItineraryController);

export default router;
