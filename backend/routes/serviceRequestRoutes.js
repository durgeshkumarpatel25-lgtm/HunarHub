const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/services
// @desc    Create new service request
// @access  Private (Customer)
router.post('/', protect, async (req, res) => {
  try {
    const { entrepreneurId, serviceDetails, preferredDate } = req.body;

    const serviceRequest = new ServiceRequest({
      customer: req.user.id,
      entrepreneur: entrepreneurId,
      serviceDetails,
      preferredDate,
    });

    const createdRequest = await serviceRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/myrequests
// @desc    Get logged in user service requests
// @access  Private (Customer)
router.get('/myrequests', protect, async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ customer: req.user.id }).populate('entrepreneur');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/services/entrepreneur
// @desc    Get service requests for logged in entrepreneur
// @access  Private (Entrepreneur)
router.get('/entrepreneur', protect, async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const requests = await ServiceRequest.find({ entrepreneur: profile._id }).populate('customer', 'name email');
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/services/:id/status
// @desc    Update service request status
// @access  Private (Entrepreneur)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, priceEstimate } = req.body;
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const profile = await EntrepreneurProfile.findOne({ user: req.user.id });
    if (!profile || request.entrepreneur.toString() !== profile._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (status) request.status = status;
    if (priceEstimate) request.priceEstimate = priceEstimate;

    const updatedRequest = await request.save();
    res.json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
