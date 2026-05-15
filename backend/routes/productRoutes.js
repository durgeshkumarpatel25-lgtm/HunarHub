const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const { protect, entrepreneur } = require('../middleware/authMiddleware');

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Entrepreneur only)
router.post('/', protect, entrepreneur, async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Entrepreneur profile not found. Please create a profile first.' });
    }

    const { name, description, price, category, images } = req.body;

    const newProduct = new Product({
      entrepreneur: profile._id,
      name,
      description,
      price,
      category,
      images,
    });

    const product = await newProduct.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products
// @desc    Get all products (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, entrepreneurId } = req.query;
    let query = {};

    if (category) query.category = category;
    if (entrepreneurId) query.entrepreneur = entrepreneurId;

    const products = await Product.find(query).populate({
      path: 'entrepreneur',
      populate: { path: 'user', select: 'name' }
    });
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: 'entrepreneur',
      populate: { path: 'user', select: 'name location' }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
