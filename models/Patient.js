//database's patient 
const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    symptoms: { type: String, required: true },
    dateOfVisit: { type: Date, required:true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
},{
    timestamps: true
    
});
const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient; 
