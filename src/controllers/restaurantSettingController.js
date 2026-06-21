import RestaurantSetting from "../models/RestaurantSetting.js";

export const getSettings = async (req, res) => {
  try {
    let settings = await RestaurantSetting.findOne();

    if (!settings) {
      settings = new RestaurantSetting({
        restaurantName: "The East Junction",
        location: "Spogmai Plaza, Near Avon Super Store, University Road, Peshawar, Pakistan",
        phone: "091-5840011",
        email: "info@theeastjunction.com",
        whatsapp: "92915840011",
        instagramUser: "theeastjunction",
        mapUrl: "https://maps.google.com/?q=Spogmai+Plaza+University+Road+Peshawar",
      });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await RestaurantSetting.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
