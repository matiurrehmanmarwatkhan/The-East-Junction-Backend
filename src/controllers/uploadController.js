export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file was uploaded." });
  }

  res.status(201).json({
    success: true,
    url: req.file.path, // Cloudinary secure CDN URL is returned in path
    originalName: req.file.originalname,
  });
};
