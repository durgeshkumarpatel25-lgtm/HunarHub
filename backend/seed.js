require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const EntrepreneurProfile = require('./models/EntrepreneurProfile');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunarhub';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await EntrepreneurProfile.deleteMany();
    console.log('Cleared existing data.');

    // 1. Create a test admin user and customer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const testUser = await User.create({
      name: 'Test Customer (ckphf)',
      email: 'ckphf@gmail.com',
      password: hashedPassword,
      role: 'customer' // or 'admin' if you want admin access
    });

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@hunarhub.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 2. Create sample entrepreneurs
    const entrepreneur1 = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh@example.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    const entrepreneur2 = await User.create({
      name: 'Sita Devi',
      email: 'sita@example.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    const entrepreneur3 = await User.create({
      name: 'Abdul Khan',
      email: 'abdul@example.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    // Create profiles for them
    await EntrepreneurProfile.create([
      {
        user: entrepreneur1._id,
        category: 'Tailor',
        skills: 'Master Tailor, Alterations, Custom Suits',
        experienceYears: 15,
        location: 'Gandhi Market, Sector 14',
      },
      {
        user: entrepreneur2._id,
        category: 'Potter',
        skills: 'Ceramics, Hand-painted Pottery, Clay Modeling',
        experienceYears: 8,
        location: 'Crafts Village, North Block',
      },
      {
        user: entrepreneur3._id,
        category: 'Cobbler',
        skills: 'Leather Repair, Custom Shoes, Boot Making',
        experienceYears: 20,
        location: 'Station Road, Old City',
      }
    ]);

    console.log('Database seeded successfully!');
    console.log('Test User Login: ckphf@gmail.com / password123');
    console.log('Admin Login: admin@hunarhub.com / password123');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
