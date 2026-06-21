import Gallery from "../models/Gallery.js";

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryImages = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a gallery image
// @route   POST /api/gallery
// @access  Private (Admin only)
export const createGalleryImage = async (req, res) => {
  const { title, category } = req.body;
  
  let url = req.body.url;
  if (req.file) {
    url = req.file.path; // Cloudinary secure URL
  }

  try {
    const newImg = new Gallery({
      id: "gal_" + Date.now(),
      url: url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      title: title || "Gourmet Snapshot",
      category: category || "dishes",
    });

    await newImg.save();
    res.status(201).json(newImg);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin only)
export const updateGalleryImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Gallery.findOne({ id });

    if (!image) {
      return res.status(404).json({ error: "Gallery image not found" });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.url = req.file.path; // Cloudinary secure URL
    }

    const updatedImage = await Gallery.findOneAndUpdate({ id }, updates, { new: true });
    res.json(updatedImage);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
export const deleteGalleryImage = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await Gallery.findOneAndDelete({ id });

    if (image) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Gallery image not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
