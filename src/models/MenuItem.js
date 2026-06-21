import { Schema, model } from "mongoose";

const menuItemSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categorySlug: { type: String, required: true },
    image: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const MenuItem = model("MenuItem", menuItemSchema);
export default MenuItem;
