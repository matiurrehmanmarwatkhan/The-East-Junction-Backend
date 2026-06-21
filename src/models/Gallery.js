import { Schema, model } from "mongoose";

const gallerySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["interior", "dishes", "events", "drinks"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = model("Gallery", gallerySchema);
export default Gallery;
