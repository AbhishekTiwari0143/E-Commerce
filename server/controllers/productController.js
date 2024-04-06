import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, quantity, price, category, brand, image } =
      req.fields;

    // Validation

    switch (true) {
      case !name:
        return res.status(400).send("Name is required");
      case !description:
        return res.status(400).send("Description is required");
      case !quantity:
        return res.status(400).send("Quantity is required");
      case !price:
        return res.status(400).send("Price is required");
      case !category:
        return res.status(400).send("Category is required");
      case !brand:
        return res.status(400).send("Brand is required");
      case !image:
        return res.status(400).send("Image is required");
    }

    const product = new Product({ ...req.fields });
    await product.save();

    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, quantity, price, category, brand, image } =
      req.fields;

    // Validation

    switch (true) {
      case !name:
        return res.status(400).send("Name is required");
      case !description:
        return res.status(400).send("Description is required");
      case !quantity:
        return res.status(400).send("Quantity is required");
      case !price:
        return res.status(400).send("Price is required");
      case !category:
        return res.status(400).send("Category is required");
      case !brand:
        return res.status(400).send("Brand is required");
      case !image:
        return res.status(400).send("Image is required");
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
      },
      { new: true, runValidators: true }
    );

    await product.save();

    res.json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error.message);
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Product not Found!!" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: rating,
        comment: comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json({ message: "Review added successfully" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

export {
  addProduct,
  updateProduct,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
};
