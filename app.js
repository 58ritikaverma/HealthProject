

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const loginRoutes = require('./routes/loginRoute'); 
const adminRoutes = require('./routes/adminRoutes');
const User = require('./models/User');
const Patient = require('./models/Patient');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use((req, res, next) => {
    res.locals.user = req.session.user || null; // Pass the session user to templates
    next();
});

mongoose.connect('mongodb://localhost:27017/healthRecordDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Error connecting to MongoDB:', err);
});


app.use(patientRoutes);
app.use(authRoutes);
app.use(loginRoutes);
app.use(adminRoutes);



app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    res.render('home');  
});
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/dashboard', async (req, res) => {  
    if (req.session.user) {  
        try {  
            const patients = await Patient.find();  
            const username = req.session.user.username; // Retrieve the username from the session  
            res.render('dashboard', { patients, username }); // Pass username to the template  
        } catch (err) {  
            console.error('Error fetching patients:', err);  
            res.status(500).send('Internal Server Error');  
        }  
    } else {  
        res.redirect('/login');  
    }  
});  
app.post('/login', async (req, res) => {  
    const { email, password } = req.body;  
    const user = await User.findOne({ email });  
    
    // if (user && await bcrypt.compare(password, user.password)) { // Use bcrypt to hash/check passwords  
    //     req.session.user = user;  
    //     res.redirect('/dashboard');  
    // } else {  
    //     res.send('Invalid credentials');  
    // }  
    if (user && user.password === password) { // Replace with hashed password check
        req.session.user = {
            id: user._id,
            isAdmin: user.isAdmin // Ensure this field exists in your User model
        };
        return res.redirect('/admin');
    }

    res.status(401).send('Invalid credentials');
}); 
app.get('/register', (req, res) => {
    res.render('register'); 
});
app.get('/login', (req, res) => {
    const user = req.session.user; // Assuming user info is stored in the session
    res.render('login', { user }); // Pass user data to the template
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && user.password === password) { // Ideally, use bcrypt for password hashing
        req.session.user = user;  // Set session user
        res.redirect('/dashboard');
    } else {
        res.send('Invalid credentials');
    }
});
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            return res.redirect('/dashboard'); // Redirect to dashboard if error
        }
        res.redirect('/home'); // Redirect to home after successful logout
    });
});



app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    res.render('home');  
});


app.get('/admin', async (req, res) => { 
   
    try {  
        const users = await User.find();  
        res.render('admin', { users }); 
    } catch(error) {  
        res.status(500).send('Server Error');  
    }  
}); 
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.delete('/admin/user/:id', async (req, res) => {  
    
    try {  
        await User.findByIdAndDelete(req.params.id);  
        res.status(200).send('User deleted successfully');  
    } catch (error) {  
        res.status(500).send('Error deleting user');  
    }  
});  
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.listen(3000, ()=> {
    console.log('Server is running on port 3000');
});