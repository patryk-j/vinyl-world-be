import { Router } from "express";
import jwt from "jsonwebtoken";

import { authenticationToken } from "../middleware/authenticationToken.js";
import User from "../models/user.js";
import Rent from "../models/rent.js";
import Vinyl from "../models/vinyl.js";

const router = Router();

router.post("/addReservation", authenticationToken, async (req, res) => {
  const { vinylId, rentalDate, title, artist } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  try {
    const { email } = await jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ email: email });

    await Rent.create({
      userId: user.id,
      email: user.email,
      vinylId: vinylId,
      rentalDate: rentalDate,
      title: title,
      artist: artist,
    });

    await Vinyl.findOneAndUpdate(
      { _id: vinylId },
      { isReserved: true },
      { new: true }
    );

    res
      .status(200)
      .json({
        message: "The vinyl record has been reserved.",
        isReserved: true,
      });
  } catch (error) {
    res.status(403).json({ message: "Error with the vinyl disc reservation." });
  }
});

router.get("/getReservations", authenticationToken, async (req, res) => {
  try {
    const reservations = await Rent.find();
    res.status(200).json(reservations);
  } catch (error) {
    res
      .status(403)
      .json({ message: "Error with downloading all reservations." });
  }
});

router.get("/getUserReservations", authenticationToken, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const { email } = await jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ email: email });

  try {
    const reservations = await Rent.find({ userId: user.id });
    res.status(200).json(reservations);
  } catch (error) {
    res
      .status(403)
      .json({ message: "Error while retrieving a reservation for a user." });
  }
});

router.delete(
  "/deleteReservationForUser",
  authenticationToken,
  async (req, res) => {
    const { _id } = req.body;
    try {
      try {
        const reservation = await Rent.findOne({ _id: _id });

        if (reservation) {
          await Vinyl.updateOne(
            { _id: reservation.vinylId },
            { isReserved: false }
          );
        }

        await Rent.deleteOne({ _id: _id });
        res.status(200).json({ message: "The reservation has been deleted." });
      } catch (error) {
        res
          .status(403)
          .json({ message: "Error while deletion of reservation." });
      }
    } catch (error) {
      res.status(403).json({ message: "Invalid token." });
    }
  }
);

router.put("/updateEmail", authenticationToken, async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { newEmail } = req.body;
  const { email } = await jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findOne({ email: email });

  try {
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({ message: "Email has been successfully updated." });
  } catch (error) {
    res.status(403).json({ message: "Error while updating email address." });
  }
});

export default router;
