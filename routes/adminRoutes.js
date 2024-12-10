const express = require('express');
const User = require('../models/User');
const Patient = require('../models/Patient');
const bcrypt = require('bcrypt');
const MedicalHistory = require('../models/MedicalHistory');
const router = express.Router();


// Admin Login Page
router.get('/admin/login', (req, res) => {
    if (req.session.user && req.session.user.isAdmin) { 
        console.log('Admin session detected. Redirecting to dashboard.');
        // return res.redirect('/admin/dashboard');  
        return res.redirect('/admin/medical-history'); 
    }
    console.log('No admin session found. Rendering login page.');
    res.render('adminLogin'); 


});
router.get('/admin-login', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.redirect('/admin'); // Redirect to admin page
        }
    } catch (error) {
        console.error("Error in GET /admin-login:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Admin Login Handler
router.post('/admin-login', async (req, res) => {
    const { email, password } = req.body;

    // console.log("@@@@@@@@@");

     try {
        console.log("Admin login route hit");
        // console.log("Received Email:", email, "Received Password:", password);
        // console.log(email);

        const user = await User.findOne({ email });

        if (!user) {
            console.log("No user found with email:", email);
            return res.status(401).send('Invalid admin credentials');
        }
        console.log("User found:", user);  
        if (!user.isAdmin) {
            console.log("User is not an admin:", user);
            return res.status(401).send('Invalid admin credentials');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log("Password mismatch for email:", email);
            return res.status(401).send('Invalid adminloginPassword credentials');
        }

        
        req.session.user = {
             id: user._id, 
             email: user.email, 
             isAdmin: true,
             };
             console.log("Admin login successful for user:", user);
            //  return res.status(200).send('admin login successfull');
            return res.redirect('/admin/medical-history');
        // return res.redirect('/admin-login');// this line is imp for reach
    } catch (err) {
        console.error("Error in admin login route:", err);
        return res.status(500).send('Internal Server Error');
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
                username: user.email,
                isAdmin: true,
               
            };
            console.log("Session user:", req.session.user);
            return res.redirect('/admin');
        } else {
            console.log("Invalid login credentials");
            return res.status(401).send('Invalid admin credentials');
        }
    } catch (error) {
        console.error('Admin Login error:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admin', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.isAdmin) {  
            return res.status(403).send('Forbidden');  
        }  
         const medicalHistories = await MedicalHistory.find(); 

    res.render('admin', { medicalHistories });
     } catch (err) {
        console.error("Error in /admin route:",err);
        res.status(500).send("Server Error");
    }
});
router.get('/admin/medical-history', async (req, res) => {
    try {
        if (!req.session.user || !req.session.user.isAdmin) {
            return res.status(403).send('Access Denied');
        }

        // Fetch all medical records
        const records = await MedicalHistory.find({});
        
        // Render the medical history page and pass the records
        res.render('medicalHistory', { records });
    } catch (err) {
        console.error("Error fetching medical history:", err);
        res.status(500).send('Internal Server Error');
    }
});
// router.get('/admin/medical-history', (req, res) => {
//     console.log('Accessing /admin/medical-history');
//     if (!req.session.user || !req.session.user.isAdmin) {
//         return res.status(403).send('Access Denied');
//     }
//     // Fetch records from MongoDB
//     MedicalHistory.find({}, (err, records) => {
//         if (err) {
//             console.error('Error fetching records:', err);
//             return res.status(500).send('Error fetching records');
//         }

//         // Render the view and pass the records
//         res.render('medicalHistory', { records });
//     });
// });

// Your route for /admin/medical-history
router.get('/admin/medical-history', (req, res) => {
    console.log('Accessing /admin/medical-history');
    res.render('medicalHistory');  // This is the view you want to render
});


module.exports = router;