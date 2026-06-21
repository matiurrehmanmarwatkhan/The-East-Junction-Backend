import BirthdayEvent from "../models/BirthdayEvent.js";

// @desc    Get all birthday events
// @route   GET /api/events
// @access  Public
export const getBirthdayEvents = async (req, res) => {
  try {
    const events = await BirthdayEvent.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a birthday event package
// @route   POST /api/events
// @access  Private (Admin only)
export const createBirthdayEvent = async (req, res) => {
  const { name, description, pricePerPerson, exclusions, inclusions, popular } = req.body;

  let image = req.body.image;
  if (req.file) {
    image = req.file.path; // Cloudinary secure CDN URL
  }

  // Handle parsing multipart/form-data values
  const parsedPrice = Number(pricePerPerson);
  const parsedPopular = popular === "true" || popular === true;
  
  const finalInclusions = Array.isArray(inclusions)
    ? inclusions
    : (Array.isArray(exclusions) ? exclusions : []);

  let parsedInclusions = [];
  if (finalInclusions.length > 0) {
    parsedInclusions = finalInclusions;
  } else {
    // If sent as a string list or JSON string in multipart
    const rawInc = inclusions || exclusions;
    if (rawInc && typeof rawInc === "string") {
      try {
        parsedInclusions = JSON.parse(rawInc);
      } catch {
        parsedInclusions = rawInc.split(",").map((t) => t.trim());
      }
    }
  }

  try {
    const newEvent = new BirthdayEvent({
      id: "event_" + Date.now(),
      name,
      description,
      pricePerPerson: parsedPrice,
      image: image || "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80",
      inclusions: parsedInclusions,
      popular: parsedPopular,
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a birthday event package
// @route   PUT /api/events/:id
// @access  Private (Admin only)
export const updateBirthdayEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await BirthdayEvent.findOne({ id });

    if (!event) {
      return res.status(404).json({ error: "Birthday event package not found." });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.image = req.file.path; // Cloudinary secure URL
    }

    if (updates.pricePerPerson !== undefined) {
      updates.pricePerPerson = Number(updates.pricePerPerson);
    }

    if (updates.popular !== undefined) {
      updates.popular = updates.popular === "true" || updates.popular === true;
    }

    // Handle inclusions parsing
    const rawIncls = updates.inclusions !== undefined ? updates.inclusions : updates.exclusions;
    if (rawIncls !== undefined) {
      let parsedInclusions = [];
      if (Array.isArray(rawIncls)) {
        parsedInclusions = rawIncls;
      } else if (typeof rawIncls === "string") {
        try {
          parsedInclusions = JSON.parse(rawIncls);
        } catch {
          parsedInclusions = rawIncls.split(",").map((t) => t.trim());
        }
      }
      updates.inclusions = parsedInclusions;
    }

    const updatedEvent = await BirthdayEvent.findOneAndUpdate({ id }, updates, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a birthday event package
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
export const deleteBirthdayEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await BirthdayEvent.findOneAndDelete({ id });

    if (event) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Birthday event package not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
