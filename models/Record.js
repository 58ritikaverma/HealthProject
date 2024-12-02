const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: String,
  details: String,
});

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;
