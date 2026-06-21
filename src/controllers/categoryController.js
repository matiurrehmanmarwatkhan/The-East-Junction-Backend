import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name, slug, icon } = req.body;

  try {
    const newCat = new Category({
      id: "cat_" + Date.now(),
      name,
      slug: slug.toLowerCase(),
      icon: icon || "Utensils",
    });

    await newCat.save();
    res.status(201).json(newCat);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findOneAndDelete({ id });

    if (category) {
      res.json({ success: true, message: "Category excised successfully." });
    } else {
      res.status(404).json({ success: false, message: "Category not found." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
