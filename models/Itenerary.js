import mongoose, { Schema } from "mongoose";

const DaySchema = new Schema({
  day: Number,
  date: String,
  activities: [String],
});

const ItinerarySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    days: [DaySchema],
  },
  { timestamps: true }
);

const Itinerary = mongoose.model("Itinerary", ItinerarySchema);
export default Itinerary;
