const mongoose = require('mongoose');  
const bcrypt = require('bcrypt');  
const User = require('./models/User'); // Ensure the path is correct  
require('dotenv').config(); // Load environment variables from .env file  

// Connect to the database using the URI from environment variables  
const mongoUri = process.env.MONGODB_URI; // Access the MongoDB URI  
const adminPassword = process.env.ADMIN_PASSWORD;
if (!mongoUri || !adminPassword) {  
    console.error('MONGODB_URI and ADMIN_PASSWORD must be defined in the .env file');  
    process.exit(1);  
}  

mongoose.connect(mongoUri, {  
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

        // Hash the password from environment variables  
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10); // Use the password from .env  
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