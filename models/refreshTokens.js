import mongoose from "mongoose";

const refreshTokensSchema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
  },
  { collection: "refresh-tokens" }
);

export default mongoose.model("RefreshTokens", refreshTokensSchema);
