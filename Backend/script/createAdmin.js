require('dotenv').config({ path: '../.env' }); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const adminData = {
      username: 'admin',
      email: 'alfinakash2001@gmail.com',
      password: 'Admin@123',
      role: 'admin',
    };

    const existingAdmin = await User.findOne({
      $or: [{ email: adminData.email }, { username: adminData.username }],
    });

    if (existingAdmin) {
      console.log('❌ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    await User.create({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      role: adminData.role,
    });

    console.log('✅ Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
