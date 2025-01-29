import mongoose from "mongoose";

const vinylSchema = new mongoose.Schema(
  {
    artist: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    isReserved: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "vinyls" }
);

export default mongoose.model("Vinyl", vinylSchema);
