import { Schema, model } from "mongoose";

const reservationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    specialRequest: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Reservation = model("Reservation", reservationSchema);
export default Reservation;
