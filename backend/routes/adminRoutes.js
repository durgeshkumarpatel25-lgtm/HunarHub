const express = require('express');
const router = express.Router();
const User = require('../models/User');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const Order = require('../models/Order');
const ServiceRequest = require('../models/ServiceRequest');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private (Admin only)
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEntrepreneurs = await EntrepreneurProfile.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalServiceRequests = await ServiceRequest.countDocuments();

    // Calculate total order revenue
    const orders = await Order.find({ status: { $in: ['Delivered', 'Completed'] } });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
      totalUsers,
      totalEntrepreneurs,
      totalOrders,
      totalServiceRequests,
      totalRevenue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/entrepreneurs
// @desc    Get all entrepreneurs for verification
// @access  Private (Admin only)
router.get('/entrepreneurs', protect, admin, async (req, res) => {
  try {
    const entrepreneurs = await EntrepreneurProfile.find().populate('user', 'name email');
    res.json(entrepreneurs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/entrepreneurs/:id/verify
// @desc    Verify entrepreneur profile
// @access  Private (Admin only)
router.put('/entrepreneurs/:id/verify', protect, admin, async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    profile.isVerified = true;
    await profile.save();
    res.json({ message: 'Entrepreneur verified successfully', profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
