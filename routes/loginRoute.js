
//------------

const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');  // Adjust the path to your User model if needed
const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).send('Invalid credentials'); // User not found
        }
    //     if (user && await bcrypt.compare(password, user.password)) {
            
    //         req.session.user = { id: user._id, email: user.email };

            
    //         return res.redirect('/dashboard');
    //     } else {
            
    //         return res.status(401).send('Invalid credentials');
    //     }
    // } catch (err) {
    //     console.error('Error logging in user:', err);
    //     res.status(500).send('Internal Server Error');
    // }

// });
 // Verify the password using bcrypt
 const isPasswordMatch = await bcrypt.compare(password, user.password);
 if (!isPasswordMatch) {
     console.log('Password mismatch for user:', email);
     return res.status(401).send('Invalid credentials'); // Password is incorrect
 }

 // Set up session data
 req.session.user = {
     _id: user._id,
     email: user.email,
     isAdmin: user.isAdmin // Include isAdmin for admin checks
 };

 console.log('User logged in successfully:', req.session.user);

 // Redirect to the appropriate dashboard or admin page
 return res.redirect('/admin'); // Adjust this route if needed
} catch (err) {
 console.error('Error logging in user:', err);
 res.status(500).send('Internal Server Error');
}
});

module.exports = router;