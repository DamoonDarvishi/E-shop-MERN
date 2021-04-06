const { Product } = require("../models/product");
const { Category } = require("../models/category");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// GET products list
router.get(`/`, async (req, res) => {
  // const productList = await Product.find().select("name image -_id");
  const productList = await Product.find().populate("category");

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send(productList);
});

// GET product details
router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500).json({ success: false });
  }

  res.send(product);
});

// POST product
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }

  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  try {
    product = await product.save();
  } catch (err) {
    console.log("Catch an error: ", err);
  }

  if (!product) {
    return res.status(500).send("The product cannot be created");
  }
  res.send(product);
});

// PUT & UPDATE
router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid product id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send("Invalid Category");
  }
  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) {
    return res.status(500).send("the product cannot be updated!");
  }

  res.send(product);
});

// DELETE product
router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "The product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ succes: false, error: err });
    });
});

// GET count for admin panel
router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments((count) => count);

  if (!productCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    productCount: productCount,
  });
});
// Get show products in first page
router.get("/get/featured/:count", async (req, res) => {
  const count = req.params.count ? req.params.count : 0; // return count of products, like this paginate
  const products = await Product.find({ isFeatured: true }).limit(+count);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
