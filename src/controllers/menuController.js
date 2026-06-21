import MenuItem from "../models/MenuItem.js";

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a menu item
// @route   POST /api/menu
// @access  Private (Admin only)
export const createMenuItem = async (req, res) => {
  const { name, description, price, categorySlug, isFeatured, tags } = req.body;
  
  let image = req.body.image;
  if (req.file) {
    image = req.file.path; // Cloudinary secure CDN URL
  }

  // Handle parsing multipart/form-data types
  const parsedPrice = Number(price);
  const parsedIsFeatured = isFeatured === "true" || isFeatured === true;
  
  let parsedTags = [];
  if (tags) {
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = tags.split(",").map((t) => t.trim());
      }
    }
  }

  try {
    const newItem = new MenuItem({
      id: "menu_" + Date.now(),
      name,
      description,
      price: parsedPrice,
      categorySlug,
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      isFeatured: parsedIsFeatured,
      tags: parsedTags,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin only)
export const updateMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await MenuItem.findOne({ id });

    if (!item) {
      return res.status(404).json({ error: "Dish not found." });
    }

    const updates = { ...req.body };

    // Extract Cloudinary URL if a new image file is uploaded
    if (req.file) {
      updates.image = req.file.path;
    }

    // Handle types in multipart/form-data updates
    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }
    if (updates.isFeatured !== undefined) {
      updates.isFeatured = updates.isFeatured === "true" || updates.isFeatured === true;
    }
    if (updates.tags !== undefined) {
      if (typeof updates.tags === "string") {
        try {
          updates.tags = JSON.parse(updates.tags);
        } catch {
          updates.tags = updates.tags.split(",").map((t) => t.trim());
        }
      }
    }

    const updatedItem = await MenuItem.findOneAndUpdate({ id }, updates, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin only)
export const deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await MenuItem.findOneAndDelete({ id });

    if (item) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Dish not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
