import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/User.js";
import iteneraryRoutes from "./routes/Itenerary.js";

dotenv.config();
const app = express();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
};

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/itenerary", iteneraryRoutes);

app.listen(5000 || process.env.PORT, () => {
  connect();
  console.log("Backend Server Running");
});
