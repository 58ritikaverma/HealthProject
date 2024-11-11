const express = require('express');
const Patient = require('../models/Patient');
const router = express.Router();

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}

router.get('/patients/add', isAuthenticated, (req, res) => {
    // console.log('Session:', req.session); 
   
        res.render('patients');  
   
});

router.post('/patients/add', isAuthenticated, async (req, res) => {
    const { name, age, gender, symptoms,dateOfVisit } = req.body;
    console.log(req.body);
    // const newPatient = new Patient({ name, age, gender, symptoms });
    const isValidDate = (date) => !isNaN(Date.parse(date));

    // Check if any required field is missing
    if (!name || !age || !gender || !symptoms || !dateOfVisit) {
        return res.status(400).send('All fields are required.');
    }
    if (isNaN(age) || age <= 0) {
        return res.status(400).send('Invalid age.');
    }

    // Validate the dateOfVisit format
    if (isNaN(Date.parse(dateOfVisit))) {
        return res.status(400).send('Invalid date format.');
    }
    try {
        if (!name || !age || !gender || !symptoms|| !dateOfVisit) {
            return res.status(400).send('All fields are required.');
        }
        const newPatient = new Patient({
            name,
            age,
            gender,
            symptoms,
            dateOfVisit,
           //  username: req.body.username || undefined
        });
        await newPatient.save(); // Use await for the promise
       return res.redirect('/dashboard');
        // res.status(201).send(newPatient);
        res.status(201).json(newPatient);

    } catch (error) {
        console.error('Error fetching patients:', error);
        // console.error(error);
        if(!res.headersSent){
       return res.status(500).send('Internal Server Error');
    }
}
});

module.exports = router;
