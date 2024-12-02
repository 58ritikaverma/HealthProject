

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
const path = require('path'); 
const Patient = require('./models/Patient');

const app = express();
app.use(express.static('public')); // add
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false} // isko false kra tabhi login chal paya
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
app.use('/admin',adminRoutes);

// app.use('/', require('./routes/adminRoutes'));

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

// I add this currently
app.get('/register', (req, res) => {
    res.render('register'); 
});
app.post('/register', async (req, res) => {  
    const { email, password } = req.body;  
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password  

    const newUser = new User({  
        email,  
        password: hashedPassword,  
        // any other user properties  
    });  

    try {  
        await newUser.save(); // Save user in database  
        res.redirect('/login'); // Redirect to login  
    } catch (error) {  
        res.status(500).send('Error registering user');  
    }  
});


app.get('/login', (req, res) => {
    const user = req.session.user; // Assuming user info is stored in the session
    res.render('login', { user }); // Pass user data to the template
});
// login for user login
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


// app.get('/admin', async (req, res) => { 
//     console.log("Session data on /admin:",req.session.user);
//     if (req.session.user && req.session.user.isAdmin) {
//     try {  
//         const users = await User.find();  
//         return res.render('admin', { users }); 
//     } catch(error) { 
//         console.error('Error fetching users:', error); 
//         res.status(500).send('Server Error');  
//     }  
// }else{
//     console.log('Unauthorized admin access attempt');
//     res.status(403).send("Unauthorized access");
//     res.redirect('/login');
// }
// }); 
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/dashboard');
        }
        res.clearCookie('connect.sid'); // Make sure to clear the session cookie
        res.redirect('/home');
    });
});


// app.delete('/admin/user/:id', async (req, res) => {  
    
//     try {  
//         await User.findByIdAndDelete(req.params.id);  
//         res.status(200).send('User deleted successfully');  
//     } catch (error) { 
//         console.error('Error deleting user:', err); 
//         res.status(500).send('Error deleting user');  
//     }  
// });  
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


// Route for admin login
app.get('/admin/login', (req, res) => {
    console.log('Admin login route hit');
    res.render('adminLogin'); 
});
app.get('/admin', (req, res) => {
    res.redirect('/admin/login'); // Redirect to /admin/login
});
// Post route for admin login
// app.post('/admin/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await User.findOne({ email });

//         // if (user && user.password === password && user.isAdmin) { 
//          if (user && user.isAdmin && await bcrypt.compare(password, user.password)) {
//             req.session.user = {
//                 _id: user._id,
//                 email: user.email,
//                 isAdmin: true,
//             };
//             return res.redirect('/admin'); // Redirect admin to admin panel
//         } else {
//             return res.status(401).send('Invalid admin credentials');
//         }
//     } catch (error) {
//         console.error('Admin login error:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Route for general user login
app.get('/login', (req, res) => {
    res.render('login'); // Ensure login.ejs exists
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, ()=> {
    console.log('Server is running on port 3000');
});