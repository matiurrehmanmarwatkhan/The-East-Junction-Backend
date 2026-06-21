import { Schema, model } from "mongoose";

const restaurantSettingSchema = new Schema(
  {
    restaurantName: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    instagramUser: { type: String, required: true },
    mapUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const RestaurantSetting = model("RestaurantSetting", restaurantSettingSchema);
export default RestaurantSetting;
