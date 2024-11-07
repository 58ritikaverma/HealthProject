const express = require('express');
const Patient = require('../models/Patient');

const router = express.Router();
router.get('/patients/add', (req, res) => {
    // console.log('Session:', req.session); 
    if (req.session.user) {  
        res.render('patients');  
    } else {
        res.redirect('/login');  
    }
});

router.post('/patients/add', async (req, res) => {
    const { name, age, gender, symptoms,dateOfVisit } = req.body;
    console.log(req.body);
    // const newPatient = new Patient({ name, age, gender, symptoms });
    const isValidDate = (date) => !isNaN(Date.parse(date));

    // Check if any required field is missing
    if (!name || !age || !gender || !symptoms || !dateOfVisit) {
        return res.status(400).send('All fields are required.');
    }

    // Validate the dateOfVisit format
    if (!isValidDate(dateOfVisit)) {
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
