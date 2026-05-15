const mongoose = require('mongoose');

const entrepreneurProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Cobbler', 'Potter', 'Tailor', 'Artisan', 'Small vendor', 'Other'],
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  experienceYears: {
    type: Number,
  },
  location: {
    type: String,
    required: true,
  },
  gallery: {
    type: [String], // Array of image URLs
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('EntrepreneurProfile', entrepreneurProfileSchema);
