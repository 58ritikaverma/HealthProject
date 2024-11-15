const mongoose = require('mongoose');

// Define the HealthRecord schema
const healthRecordSchema = new mongoose.Schema({
    // userId: { 
        patientId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model
        required: true 
    },
    date: { 
        type: Date, 
        required: true ,
        default: Date.now
    },
    // diagonose: { 
    description: { 
        type: String, 
        required: true 
    }
    // treatment: { 
    //     type: String, 
    //     required: false 
    // },
    // medications: { 
    //     type: String, 
    //     required: false 
    // }
// }, { timestamps: true 
}); // Automatically adds 'createdAt' and 'updatedAt' fields

// Create the HealthRecord model
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;
