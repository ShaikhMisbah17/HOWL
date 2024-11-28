require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { connectDB } = require("./database");
const Product = require("./Models/product");
const User = require("./Models/user");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// Connection to MongoDB
connectDB();

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// Register Route
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save user
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user)
    return res.status(400).json({ message: "Invalid username or password" });

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Invalid username or password" });

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Create Product
app.post("/api/products", authenticateToken, async (req, res) => {
  const { name, price, description, stock } = req.body;

  if (!name || !price || !description || !stock) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = new Product({ name, price, description, stock });

  try {
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error creating product", error: err });
  }
});

// Get All Products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
});

// Update Product
app.put("/api/products/:id", authenticateToken, async (req, res) => {
  const { name, price, description, stock } = req.body;
  const productId = req.params.id;

  if (!name || !price || !description || !stock) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, price, description, stock },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err });
  }
});

// Delete Product
app.delete("/api/products/:id", authenticateToken, async (req, res) => {
  const productId = req.params.id;

  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
