import express from "express";
import {
  generateItineraryController,
  getItineraryById,
  getUserItineraries,
} from "../controllers/Itenerary.js";
import { verifyToken } from "../middlewares/auth.js";
const router = express.Router();

// Itenerary Routes
router.post("/generateItenerary", verifyToken, generateItineraryController);
router.get("/getItinerariesByUser", verifyToken, getUserItineraries);
router.get("/getItineraryById", verifyToken, getItineraryById);

export default router;
