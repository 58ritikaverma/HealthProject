const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Ensure the path is correct

// Connect to the database
mongoose.connect('mongodb://localhost:27017/healthRecordDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function createAdminUser() {
    try {
        // Check if an admin user already exists
        const existingAdmin = await User.findOne({ isAdmin: true });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        // Create a new admin user
        const hashedPassword = await bcrypt.hash('yourPasswordHere', 10); // Replace 'yourPasswordHere' with a secure password
        const adminUser = new User({
            username: 'admin',
            password: hashedPassword,
            isAdmin: true,
        });

        await adminUser.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close(); // Close the connection after the script runs
    }
}

// Run the function
createAdminUser();
