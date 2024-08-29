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
    const { userId, source, destination, start_date, end_date, budget } =
      req.body;

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const no_of_day = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    const prompt = `Generate a personalized trip itinerary for a ${no_of_day}-day trip from ${source} to ${destination} from ${start_date} to ${end_date}, with an optimum budget of ${budget} INR.`;

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

export { generateItineraryController };
