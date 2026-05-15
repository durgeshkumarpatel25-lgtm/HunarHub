const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Get product details from DB to calculate total and verify entrepreneur
    let totalAmount = 0;
    let entrepreneurId = null;
    const productsList = [];

    for (let item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (!entrepreneurId) {
        entrepreneurId = product.entrepreneur;
      } else if (entrepreneurId.toString() !== product.entrepreneur.toString()) {
        return res.status(400).json({ message: 'Cannot order products from multiple entrepreneurs in a single order' });
      }

      totalAmount += product.price * item.quantity;
      productsList.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = new Order({
      customer: req.user.id,
      entrepreneur: entrepreneurId,
      products: productsList,
      shippingAddress,
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private (Customer)
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).populate('entrepreneur').populate('products.product');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/entrepreneur
// @desc    Get orders for logged in entrepreneur
// @access  Private (Entrepreneur)
router.get('/entrepreneur', protect, async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const orders = await Order.find({ entrepreneur: profile._id }).populate('customer', 'name email').populate('products.product');
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Entrepreneur)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify entrepreneur owns this order
    const profile = await EntrepreneurProfile.findOne({ user: req.user.id });
    if (!profile || order.entrepreneur.toString() !== profile._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
