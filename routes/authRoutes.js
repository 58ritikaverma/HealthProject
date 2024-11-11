const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Register Route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).send('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });

   
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
try{
    const user = await User.findOne({ username });
    if (!user) {
        return res.send('Invalid username');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).send('Invalid password');
    }

    // Store user info in session
    // req.session.user = user;
    req.session.user = {  id: user._id,username: user.username };
    res.redirect('/dashboard');
}catch(error){
    console.error('Error logging in user:', error); // Improved error logging
        res.status(500).send('Internal Server Error');
}
});

// Logout Route
router.get('/logout', (req, res) => {
    // req.session.destroy();
    // res.redirect('/login');
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.redirect('/login');
    });
});

module.exports = router;
