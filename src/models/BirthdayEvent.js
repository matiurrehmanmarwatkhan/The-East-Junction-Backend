import { Schema, model } from "mongoose";

const birthdayEventSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    pricePerPerson: { type: Number, required: true },
    inclusions: { type: [String], default: [] },
    image: { type: String, required: true },
    popular: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const BirthdayEvent = model("BirthdayEvent", birthdayEventSchema);
export default BirthdayEvent;
