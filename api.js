import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.API_KEY);

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `Generate a personalized trip itinerary for a 10-day trip from Delhi to Mumbai from 09/01/2024 to 09/10/2024 , with an optimum budget of 20000 INR in days format without **`;

const result = await model.generateContent(prompt);
console.log(result.response.text());
