import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseItineraryText } from "../utils/parsingItenerary.js";
import Itinerary from "../models/Itenerary.js";
import User from "../models/User.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateItineraryController = async (req, res) => {
  try {
    const { userId, source, destination, startDate, returnDate, budget } =
      req.body;

    const start_date = new Date(startDate);
    const return_date = new Date(returnDate);
    const no_of_day = Math.ceil(
      (return_date - start_date) / (1000 * 60 * 60 * 24)
    );

    const prompt = `Generate a personalized trip itinerary for a ${no_of_day}-day trip from ${source} to ${destination} from ${startDate} to ${returnDate}, with an optimum budget of ${budget} INR.`;

    const result = await model.generateContent(prompt);
    const itineraryText = result.response.text();
    console.log("inside the generate controller", itineraryText);

    const { days } = parseItineraryText(itineraryText);

    const itineraryData = {
      title: `${no_of_day}-Day ${source} to ${destination} Trip`,
      budget: budget,
      days: days,
    };

    const newItinerary = new Itinerary(itineraryData);
    await newItinerary.save();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.itineraries.push(newItinerary._id);
    await user.save();

    res.status(200).json({
      message: "Itinerary generated and saved successfully",
      itinerary: newItinerary,
    });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res.status(500).json({ error: "Failed to generate itinerary" });
  }
};

const getUserItineraries = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).populate("itineraries");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ itineraries: user.itineraries });
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getItineraryById = async (req, res) => {
  try {
    const itineraryId = req.query.itineraryId;

    if (!itineraryId) {
      return res.status(400).json({ message: "Itinerary ID is required" });
    }

    const itinerary = await Itinerary.findById(itineraryId);

    if (!itinerary) {
      return res.status(404).json({ message: "Itinerary not found" });
    }

    res.status(200).json({ itinerary });
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { generateItineraryController, getUserItineraries, getItineraryById };
