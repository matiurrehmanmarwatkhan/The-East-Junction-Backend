import Reservation from "../models/Reservation.js";

export const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReservation = async (req, res) => {
  const { name, email, phone, date, time, guests, specialRequest } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: "Required reservation files missing." });
  }

  try {
    const newRes = new Reservation({
      id: "res_" + Date.now(),
      name,
      email: email || "",
      phone,
      date,
      time,
      guests: Number(guests),
      specialRequest: specialRequest || "",
      status: "pending",
    });

    await newRes.save();
    res.status(201).json(newRes);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const reservation = await Reservation.findOne({ id });

    if (!reservation) {
      return res.status(404).json({ error: "Reservation listing not found." });
    }

    if (status !== undefined) {
      reservation.status = status;
    }

    await reservation.save();
    res.json(reservation);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  const { id } = req.params;

  try {
    const reservation = await Reservation.findOneAndDelete({ id });

    if (reservation) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Reservation listing not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
