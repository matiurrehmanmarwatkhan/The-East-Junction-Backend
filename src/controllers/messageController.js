import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const newMsg = new Message({
      id: "msg_" + Date.now(),
      name,
      email,
      phone,
      subject: subject || "General Inquiry",
      message,
      date: new Date().toISOString().split("T")[0],
      isRead: false,
    });

    await newMsg.save();
    res.status(201).json(newMsg);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const markMessageRead = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findOne({ id });

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    message.isRead = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Message.findOneAndDelete({ id });

    if (message) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
