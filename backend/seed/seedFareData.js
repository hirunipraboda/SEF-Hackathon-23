const mongoose = require('mongoose');
require('dotenv').config();
const Station = require('../models/Station');
const FareRate = require('../models/FareRate');

const stations = [
  { name: 'Colombo Fort', distanceFromColombo: 0 },
  { name: 'Kandy', distanceFromColombo: 121 },
  { name: 'Galle', distanceFromColombo: 116 },
  { name: 'Jaffna', distanceFromColombo: 396 },
  { name: 'Anuradhapura', distanceFromColombo: 206 },
  { name: 'Kurunegala', distanceFromColombo: 94 },
  { name: 'Matara', distanceFromColombo: 160 },
  { name: 'Badulla', distanceFromColombo: 293 }
];

const fareRates = [
  { trainClass: '1st', baseFare: 150, ratePerKm: 8.5 },
  { trainClass: '2nd', baseFare: 80, ratePerKm: 4.5 },
  { trainClass: '3rd', baseFare: 40, ratePerKm: 2.2 }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Station.deleteMany({});
    await FareRate.deleteMany({});
    await Station.insertMany(stations);
    await FareRate.insertMany(fareRates);
    console.log('Fare data seeded successfully');
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    process.exit();
  }
}

seed();
