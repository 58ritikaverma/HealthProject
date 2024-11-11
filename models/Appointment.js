const mongoose = require('mongoose');

// Define the Appointment schema
const appointmentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    doctor: { 
        type: String, 
        required: true 
    },
    notes: { 
        type: String, 
        required: false 
    }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

// Create the Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
