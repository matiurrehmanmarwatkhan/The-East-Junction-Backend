import { GoogleGenAI, Type } from "@google/genai";
import MenuItem from "../models/MenuItem.js";
import Reservation from "../models/Reservation.js";
import Message from "../models/Message.js";

let aiClient = null;

function getAI() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const getSimulationResponse = (message) => {
  const lower = message.toLowerCase();
  let text = "Welcome to The East Junction Peshawar! I am EastBot, your server-side assistant. It seems there is no API key configured in our Secrets yet, but I am happy to help! We are located at Spogmai Plaza, Near Avon Super Store, University Road, Peshawar and open 11:00 AM to 12:00 AM. Call us at 0915840011.";

  if (lower.includes("reserve") || lower.includes("table") || lower.includes("booking") || lower.includes("book")) {
    text = "Absolutely! I can assist you with your table reservation. Please share your Name, Phone Number, Date, Time, and Guest Count, and we will get your table ready at The East Junction Peshawar!";
  } else if (lower.includes("location") || lower.includes("kahan") || lower.includes("address") || lower.includes("where")) {
    text = "The East Junction Peshawar is located at Spogmai Plaza, Near Avon Super Store, University Road, Peshawar. Drive over or find us on Google Maps!";
  } else if (lower.includes("menu") || lower.includes("khana") || lower.includes("dishes") || lower.includes("eat")) {
    text = "We have wonderful dishes! Some of our most popular are the Turkish Platter (Rs. 1850), Signature Gourmet Burger (Rs. 850), Tarragon Grilled Steak (Rs. 1650), and Chicken Mushroom Pasta (Rs. 1150). Try our refreshing Mint Lemonade too!";
  } else if (lower.includes("birthday") || lower.includes("event") || lower.includes("salgira")) {
    text = "Yes! We specialize in premium Birthday event setups. Please share the Event Type, Date, Guest Count, and Decoration Requirements so we can organize it perfectly!";
  }
  return text;
};

export const chatWithBot = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "No message was provided." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.startsWith("AIzaSy")) {
    // Offline simulation mode
    return res.json({ text: getSimulationResponse(message) });
  }

  try {
    const ai = getAI();

    const liveItems = await MenuItem.find().limit(15);
    const currentMenuSummary = liveItems
      .map((item) => `- ${item.name}: Rs. ${item.price} (${item.description})`)
      .join("\n");

    const systemInstruction = `You are EastBot, the official restaurant concierge and AI Assistant for "The East Junction Peshawar".
Your personality is friendly, professional, fast, helpful, and restaurant-focused. Use short, crisp, clear responses (maximum 2-3 sentences where possible, 4 sentences absolute max).

Languages:
- You speak fluently in English, Urdu, and Roman Urdu. Match the customer's language.
- If they write in English, reply in English.
- If they write in Roman Urdu, respond in Roman Urdu.

Restaurant Information:
- Name: The East Junction
- Location: Spogmai Plaza, Near Avon Super Store, University Road, Peshawar
- Timings: 11:00 AM – 12:00 AM daily
- Contact Phone: 0915840011
- Cuisine offered: Pizza, Burgers, Steaks, Pasta, Biryani, Fried Rice, Turkish Platters, BBQ, Beverages.

Our Current Live Menu Items:
${currentMenuSummary}

Popular Items to Recommend:
- Signature Gourmet Burger, Beef Steak Burger, Pizza, Tarragon Grilled Chicken (Tarragon Grilled Steak), Chicken Mushroom Fettuccine Pasta, Turkish Platter, Fried Rice with Beef Chilli, Mint Lemonade.

Primary Goals:
1. Suggest dishes based on user preferences.
2. Direct customers gently toward Table Reservations or Birthday Event bookings.
3. Suggest a Custom Birthday Setup if a birthday or celebration is mentioned.
4. Promote direct WhatsApp ordering (0915840011).

Reservation Flow:
Ask and collect Name, Phone Number, Date, Time, and Number of Guests. Call 'addReservation' tool once you have them.

Birthday Event Flow:
Ask and collect Event Type, Date, Guest Count, Decoration Requirements, and Contact Number. Call 'addContactMessage' with subject 'Birthday Booking Request' once collected.`;

    const contents = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const addReservationTool = {
      functionDeclarations: [
        {
          name: "addReservation",
          description: "Creates a real table reservation at The East Junction. Call this once you have gathered: Name, Phone Number, Date, Time, and Number of Guests.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              date: { type: Type.STRING, description: "YYYY-MM-DD format" },
              time: { type: Type.STRING, description: "HH:MM format" },
              guests: { type: Type.NUMBER },
              specialRequest: { type: Type.STRING },
            },
            required: ["name", "phone", "date", "time", "guests"],
          },
        },
        {
          name: "addContactMessage",
          description: "Creates an inquiry, reservation event or birthday booking in the contact ledger.",
          parameters: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              phone: { type: Type.STRING },
              subject: { type: Type.STRING },
              message: { type: Type.STRING },
            },
            required: ["name", "phone", "subject", "message"],
          },
        },
      ],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        tools: [addReservationTool],
      },
    });

    const functionCalls = response.functionCalls;
    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];

      if (call.name === "addReservation") {
        const args = call.args;
        const newRes = new Reservation({
          id: "res_" + Date.now(),
          name: args.name,
          email: "",
          phone: args.phone,
          date: args.date,
          time: args.time,
          guests: Number(args.guests) || 2,
          specialRequest: args.specialRequest || "",
          status: "pending",
        });
        await newRes.save();

        try {
          const secondResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              ...contents,
              response.candidates?.[0]?.content,
              {
                role: "tool",
                parts: [
                  {
                    functionResponse: {
                      name: "addReservation",
                      response: { success: true, reservation: newRes },
                    },
                  },
                ],
              },
            ],
            config: {
              systemInstruction,
              tools: [addReservationTool],
            },
          });
          return res.json({
            text: secondResponse.text,
            reservationCreated: newRes,
          });
        } catch {
          return res.json({
            text: `Shukriya! Table reserved ho gayi hai. Details:\n- Name: ${newRes.name}\n- Date: ${newRes.date}\n- Time: ${newRes.time}\n- Guests: ${newRes.guests}\nHum jald hi aapse raabta krenge! Status pending hai.`,
            reservationCreated: newRes,
          });
        }
      }

      if (call.name === "addContactMessage") {
        const args = call.args;
        const newMsg = new Message({
          id: "msg_" + Date.now(),
          name: args.name,
          email: "",
          phone: args.phone,
          subject: args.subject,
          message: args.message,
          date: new Date().toISOString().split("T")[0],
          isRead: false,
        });
        await newMsg.save();

        try {
          const secondResponse = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: [
              ...contents,
              response.candidates?.[0]?.content,
              {
                role: "tool",
                parts: [
                  {
                    functionResponse: {
                      name: "addContactMessage",
                      response: { success: true, message: newMsg },
                    },
                  },
                ],
              },
            ],
            config: {
              systemInstruction,
              tools: [addReservationTool],
            },
          });
          return res.json({
            text: secondResponse.text,
            messageCreated: newMsg,
          });
        } catch {
          return res.json({
            text: `Thank you! Your event booking or inquiry has been received. Our team will contact you back on ${newMsg.phone} shortly!`,
            messageCreated: newMsg,
          });
        }
      }
    }

    return res.json({
      text: response.text,
    });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return res.json({
      text: getSimulationResponse(message),
    });
  }
};
