const express = require('express');
const router = express.Router();
const EntrepreneurProfile = require('../models/EntrepreneurProfile');
const { protect, entrepreneur } = require('../middleware/authMiddleware');

// @route   POST /api/entrepreneurs
// @desc    Create or update an entrepreneur profile
// @access  Private (Entrepreneur only)
router.post('/', protect, entrepreneur, async (req, res) => {
  try {
    const { category, skills, experienceYears, location, gallery } = req.body;

    const profileFields = {
      user: req.user.id,
      category,
      skills,
      experienceYears,
      location,
      gallery,
    };

    let profile = await EntrepreneurProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await EntrepreneurProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new EntrepreneurProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/entrepreneurs
// @desc    Get all entrepreneur profiles (with search/filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, location, search, limit } = req.query;
    let query = {};

    if (category) query.category = category;
    if (location) query.location = { $regex: location, $options: 'i' };
    
    // Optional: add text search based on skills or name
    if (search) {
      query.skills = { $regex: search, $options: 'i' };
    }

    let moongooseQuery = EntrepreneurProfile.find(query).populate('user', ['name', 'email']);
    
    if (limit) {
      moongooseQuery = moongooseQuery.limit(parseInt(limit));
    }

    const profiles = await moongooseQuery;
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/entrepreneurs/:id
// @desc    Get entrepreneur profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const profile = await EntrepreneurProfile.findById(req.params.id).populate('user', ['name', 'email']);
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
