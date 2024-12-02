const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path if needed

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/healthRecordDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

async function createAdminUser() {
  const email = 'admin@gmail.com'; 
  const password = 'admin123';   
  const username = 'adminUser'; // Add a username value
//   try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const adminUser = new User({
      name: 'Admin User',
      username,
      email :email,
      password: hashedPassword,
      isAdmin: true,
    });
try{
    await adminUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
}

createAdminUser();
