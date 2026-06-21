import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, default: "" },
    phone: { type: String, required: true },
    subject: { type: String, default: "General Inquiry" },
    message: { type: String, required: true },
    date: { type: String },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Message = model("Message", messageSchema);
export default Message;
