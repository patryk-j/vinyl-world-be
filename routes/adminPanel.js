import { Router } from "express";

import { authenticationToken } from "../middleware/authenticationToken.js";
import User from "../models/user.js";
import Vinyl from "../models/vinyl.js";
import Rent from "../models/rent.js";

const router = Router();

router.post("/add", authenticationToken, async (req, res) => {
  const { artist, title, isReserved } = req.body;

  try {
    await Vinyl.create({
      title: title,
      artist: artist,
      image:
        "https://cdn.pixabay.com/photo/2017/04/19/10/24/vinyl-2241789_1280.png",
      isReserved: isReserved || false,
    });
    res.status(200).json({ message: "Vinyl has been successfully added." });
  } catch (error) {
    res.status(403).json({ message: "Vinyl already exist." });
  }
});

router.get("/getVinyls", authenticationToken, async (req, res) => {
  try {
    const vinyls = await Vinyl.find();
    res.status(200).json(vinyls);
  } catch (error) {
    res.status(403).json({ message: "Error while downloading data." });
  }
});

router.delete("/deleteVinyl", authenticationToken, async (req, res) => {
  const { _id } = req.body;
  try {
    const vinyl = await Vinyl.findById(_id);
    if (!vinyl) {
      return res.status(404).json({ message: "Vinyl not found." });
    }
    if (vinyl.isReserved) {
      await Rent.deleteOne({ vinylId: _id });
    }
    await Vinyl.deleteOne({ _id: _id });

    res.status(200).json({ message: "Vinyl has been removed." });
  } catch (error) {
    res.status(403).json({ message: "Error with vinyl removal." });
  }
});

router.delete("/deleteReservation", authenticationToken, async (req, res) => {
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
      res.status(403).json({ message: "Error while deletion of reservation." });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
});

router.get("/getUsers", authenticationToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(403).json({ message: "Problem with downloading user data." });
  }
});

export default router;
