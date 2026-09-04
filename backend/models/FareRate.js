const mongoose = require('mongoose');

const fareRateSchema = new mongoose.Schema({
  trainClass: { type: String, required: true, unique: true },
  baseFare: { type: Number, required: true },
  ratePerKm: { type: Number, required: true }
});

module.exports = mongoose.model('FareRate', fareRateSchema);
