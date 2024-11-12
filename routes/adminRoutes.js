const express = require('express');
const User = require('../models/User'); // Ensure the path to your User model is correct
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord'); 
const router = express.Router();

// Middleware to check if the user is authenticated and is an admin
function checkAdmin(req, res, next) {
       if (req.session.user && req.session.user.isAdmin) {
        return next(); // User is authenticated and is an admin, proceed to the next middleware or route handler
    }
    return res.status(403).send('Unauthorized access'); // Deny access if not an admin
}

// Route to create an appointment for a user
router.post('/admin/appointment', checkAdmin, async (req, res) => {
    const { userId, date, doctor, notes } = req.body;

    try {
        const appointment = new Appointment({
            userId,
            date,
            doctor,
            notes
        });

        await appointment.save(); // Save the appointment in the database
        res.status(201).send('Appointment created successfully');
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).send('Error creating appointment');
    }
});


// Route to create a health record for a user
router.post('/admin/healthrecord', checkAdmin, async (req, res) => {
    const { userId, date, diagnosis, treatment, medications } = req.body;

    try {
        // Create a new health record
        const healthRecord = new HealthRecord({
            userId,           // Link to the User (patient)
            date,             // Date of the health record entry
            diagnosis,        // The diagnosis for the patient
            treatment,        // Treatment prescribed
            medications       // Medications prescribed
        });

        await healthRecord.save(); // Save the health record in the database
        res.status(201).send('Health record created successfully');
    } catch (error) {
        console.error('Error creating health record:', error);
        res.status(500).send('Error creating health record');
    }
});

// Route to display all users (Admin Panel)
router.get('/admin',checkAdmin, async (req, res) => {
    // Check if the user is authenticated and has admin privileges
    try {
        const users = await User.find();
        res.render('admin', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a user by ID
router.delete('/admin/user/:id', checkAdmin, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        
        if (!userToDelete) {
            return res.status(404).send('User not found'); // Return 404 if user doesn't exist
        }
        
        // Prevent deleting admin accounts or specific conditions
        if (userToDelete.isAdmin) {
            return res.status(403).send('Cannot delete admin users'); // Prevent deleting admin users
        }

        await User.findByIdAndDelete(req.params.id); // Delete user by ID
        res.status(200).send('User deleted successfully');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

// Route to view health record of a user
router.get('/admin/healthrecord/:userId' ,checkAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const healthRecord = await HealthRecord.findOne({ userId: user._id });
        if (!healthRecord) {
            return res.status(404).send('Health record not found');
        }
        res.render('healthRecordView', { user, healthRecord });
    } catch (error) {
        console.error('Error fetching health record:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // Find the user by email and verify the password
    try{
    const user = await User.findOne({ email });

    if (user && user.password === password) { // Replace with proper password hashing check
        req.session.user = {
            _id: user._id,
            isAdmin: user.isAdmin // Ensure this property exists in the User model
        };
        console.log('User session set:', req.session.user);
        return res.redirect('/admin');
    } else {
        return res.status(401).send('Invalid credentials');
    }
}catch(error){
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
}

});

module.exports = router;
