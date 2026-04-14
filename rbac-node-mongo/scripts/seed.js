const mongoose = require('mongoose');
const User = require('../models/User');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rbac_db');
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create Super Admin
        const superAdmin = new User({
            username: 'superadmin',
            password: 'SuperAdmin@123',
            role: 'super_admin'
        });
        await superAdmin.save();
        console.log('Super Admin created: superadmin / SuperAdmin@123');

        // Create Admin
        const adminUser = new User({
            username: 'adminuser',
            password: 'Admin@123',
            role: 'admin'
        });
        await adminUser.save();
        console.log('Admin User created: adminuser / Admin@123');

        mongoose.connection.close();
        console.log('Database seeded and connection closed');
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedDB();
