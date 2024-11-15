const mongoose = require('mongoose');  
const bcrypt = require('bcrypt');  
const User = require('./models/User'); // Ensure the path is correct  
require('dotenv').config(); // Load environment variables from .env file  

// Connect to the database using the URI from environment variables  
const mongoUri = 'mongodb://localhost:27017/yourdbname'; // Access the MongoDB URI  
const adminUsername='admin';
const adminPassword = 'admin@123';

async function createAdminUser() {  
    try {  
        // Connecting to the database  
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });  
        console.log('Connected to MongoDB');  

        const existingAdmin = await User.findOne({ isAdmin: true });  
        if (existingAdmin) {  
            console.log('Admin user already exists');  
            return;  
        }  

        const hashedPassword = await bcrypt.hash(adminPassword, 10); // Hash the password  

        const adminUser = new User({  
            username: adminUsername, // Use the variable directly  
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

// Check if the necessary environment variable is defined  
if (!mongoUri || !adminPassword) {  
    console.error('MONGODB_URI and ADMIN_PASSWORD must be defined');  
    process.exit(1);  
}  
createAdminUser();