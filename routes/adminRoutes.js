const express = require('express');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const HealthRecord = require('../models/HealthRecord');
const router = express.Router();

// Middleware to check if user is authenticated and is an admin
function checkAdmin(req, res, next) {
    if (req.session.user && req.session.user.isAdmin) {
        return next();
    }
    return res.status(403).send('Unauthorized access');
}

// Admin Panel: Display all users
router.get('/admin', checkAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin', { users }); // Ensure `admin.ejs` or equivalent exists
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && user.password === password) { // Replace with proper hashing in production
            req.session.user = {
                _id: user._id,
                isAdmin: user.isAdmin,
            };
            return res.redirect('/admin');
        } else {
            return res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Get All Patients
router.get('/patients', checkAdmin, async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve patients' });
    }
});

// Create Appointment
router.post('/admin/appointment', checkAdmin, async (req, res) => {
    const { patientId, date, doctor, notes } = req.body;

    try {
        const appointment = new Appointment({ patientId, date, doctor, notes });
        await appointment.save();
        res.status(201).send('Appointment created successfully');
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).send('Error creating appointment');
    }
});

// Get Health Records for a Patient
router.get('/health-records/:patientId', checkAdmin, async (req, res) => {
    try {
        const records = await HealthRecord.find({ patientId: req.params.patientId });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve health records' });
    }
});

module.exports = router;
