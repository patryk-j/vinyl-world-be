import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import adminPanel from "./routes/adminPanel.js";
import profile from "./routes/profile.js";

dotenv.config();

const app = express();
const port = 5000;

const connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("MongoDB connected.");
  } catch (error) {
    console.log("MongoDB connection failed.");
  }
};

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use("/adminpanel", adminPanel);
app.use("/profile", profile);

connect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
