import Category from "../models/categoryModel.js";

import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(404).json({ message: "Enter Name" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).send("Category already exist!");
    }

    const category = await new Category({ name }).save();

    res.status(201).json(category);
  } catch (error) {
    console.log(error);
  }
});
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  const existingCategory = await Category.findOne({ _id: categoryId });

  if (!existingCategory) {
    return res.status(404).send("Category not found!");
  }

  existingCategory.name = name;

  const updatedCategory = await existingCategory.save();

  res.json(updatedCategory);
});

const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;

    const remove = await Category.findByIdAndDelete(categoryId);
    res.json(remove);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});
const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

export {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategory,
  readCategory,
};
