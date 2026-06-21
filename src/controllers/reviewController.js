import Review from "../models/Review.js";
import { cloudinary } from "../config/cloudinary.js";

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Public
export const createReview = async (req, res) => {
  const { name, email, rating, message, comment, image, role } = req.body;

  const finalComment = message || comment || "";
  const finalRole = role || "Valued Diner";
  const finalCreatedDate = new Date().toISOString().split("T")[0];

  let imageUrl = image || "";

  // Intercept base64 encoded images from the review form and upload them to Cloudinary
  if (image && image.startsWith("data:image/")) {
    try {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "the_east_junction_reviews",
      });
      imageUrl = uploadRes.secure_url;
    } catch (err) {
      console.error("Cloudinary review image upload failed:", err);
      // Fallback: keep base64 or leave empty so review isn't discarded due to upload network glitch
    }
  }

  try {
    const newReview = new Review({
      id: "rev_" + Date.now(),
      name: name || "Anonymous Guest",
      email: email || "",
      rating: Number(rating || 5),
      comment: finalComment,
      message: finalComment,
      role: finalRole,
      date: finalCreatedDate,
      image: imageUrl,
      isApproved: false,
      status: "pending",
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Moderate a review (approve/reject)
// @route   PUT /api/reviews/:id
// @access  Private (Admin only)
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { status, isApproved } = req.body;

  try {
    const review = await Review.findOne({ id });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (status !== undefined) {
      review.status = status;
      review.isApproved = status === "approved";
    } else if (isApproved !== undefined) {
      review.isApproved = isApproved;
      review.status = isApproved ? "approved" : "rejected";
    }

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin only)
export const deleteReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findOneAndDelete({ id });

    if (review) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Review not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
