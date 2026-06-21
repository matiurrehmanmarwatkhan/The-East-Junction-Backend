import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    message: { type: String, default: "" },
    role: { type: String, default: "Valued Diner" },
    date: { type: String },
    image: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Review = model("Review", reviewSchema);
export default Review;
