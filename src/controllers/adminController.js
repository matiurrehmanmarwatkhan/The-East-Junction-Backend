import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Reservation from "../models/Reservation.js";
import MenuItem from "../models/MenuItem.js";
import Review from "../models/Review.js";
import Message from "../models/Message.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecretjwtkeyforeastjunctionadmin", {
    expiresIn: "30d",
  });
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username: username?.trim() });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid luxury admin credentials." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const reservationsCount = await Reservation.countDocuments();
    const pendingReservations = await Reservation.countDocuments({ status: "pending" });
    const menuItemsCount = await MenuItem.countDocuments();
    const reviewsCount = await Review.countDocuments();
    const messagesCount = await Message.countDocuments();

    res.json({
      reservationsCount,
      pendingReservations,
      menuItemsCount,
      reviewsCount,
      messagesCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
