const mongoose = require('mongoose');

const MedicalHistorySchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    dob: { type: Date }, // Date of Birth
    gender: { type: String, enum: ['M', 'F', 'Other'], default: 'Other' },
    emergencyFirstName: { type: String },
    emergencyLastName: { type: String },
    emergencyPhone: { type: String },
    relationship: { type: String },
    bloodGroup: { type: String },
    allergyDetails: { type: String },
    medicalConditions: { type: String },
    medications: { type: String },
});

const MedicalHistory = mongoose.model('MedicalHistory', MedicalHistorySchema);

module.exports = MedicalHistory;
