import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.ObjectId,
    vinylId: { type: String, required: true },
    rentalDate: { type: Array, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    email: { type: String, required: true },
  },
  { collection: "rentals" }
);

export default mongoose.model("Rent", rentalSchema);
