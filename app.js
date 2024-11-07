

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const User = require('./models/User');
const Patient = require('./models/Patient');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('public'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');



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

app.get('/home', (req, res) => {
    res.render('home');  
});


app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/', (req, res) => {
    res.redirect('/login');
});
app.get('/dashboard', async(req, res) => {
    if (req.session.user) {  
        try{
        const patients = await Patient.find();
        res.render('dashboard',{patients});
        }catch(err){
            console.error('Error fetching patients:', err);
            res.status(500).send('Internal Server Error');
        }

    } else {
        res.redirect('/login');  
    }
});
app.get('/register', (req, res) => {
    res.render('register'); 
});


app.listen(3000, ()=> {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    res.render('home');  
});

// admin routes
app.get('/admin', async (req, res) => { 
   
    try {  
        const users = await User.find(); // Fetch all users from the database  
        res.render('admin', { users }); // Render the admin page with user data  
    } catch(error) {  
        res.status(500).send('Server Error');  
    }  
}); 
app.delete('/admin/user/:id', async (req, res) => {  
    
    try {  
        await User.findByIdAndDelete(req.params.id);  
        res.status(200).send('User deleted successfully');  
    } catch (error) {  
        res.status(500).send('Error deleting user');  
    }  
});  