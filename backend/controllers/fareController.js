const Station = require('../models/Station');
const FareRate = require('../models/FareRate');

exports.getStations = async (req, res) => {
  try {
    const stations = await Station.find().sort({ name: 1 });
    res.json(stations);
  } catch (err) {
    res.status(500).json({ message: 'Could not load stations' });
  }
};

exports.calculateFare = async (req, res) => {
  try {
    const { origin, destination, trainClass } = req.body;

    if (!origin || !destination || !trainClass) {
      return res.status(400).json({ message: 'Origin, destination and train class are all required.' });
    }
    if (origin === destination) {
      return res.status(400).json({ message: 'Origin and destination cannot be the same station.' });
    }

    const originStation = await Station.findOne({ name: origin });
    const destStation = await Station.findOne({ name: destination });
    if (!originStation || !destStation) {
      return res.status(404).json({ message: 'One or both stations were not found.' });
    }

    const rate = await FareRate.findOne({ trainClass });
    if (!rate) {
      return res.status(404).json({ message: 'Invalid train class selected.' });
    }

    const distance = Math.abs(destStation.distanceFromColombo - originStation.distanceFromColombo);
    if (distance === 0) {
      return res.status(400).json({ message: 'Distance between these stations is zero.' });
    }

    const fare = Math.round(rate.baseFare + distance * rate.ratePerKm);

    res.json({
      origin,
      destination,
      trainClass,
      distanceKm: distance,
      baseFare: rate.baseFare,
      ratePerKm: rate.ratePerKm,
      totalFare: fare
    });
  } catch (err) {
    res.status(500).json({ message: 'Fare calculation failed. Please try again.' });
  }
};

exports.compareFares = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required.' });
    }
    const originStation = await Station.findOne({ name: origin });
    const destStation = await Station.findOne({ name: destination });
    if (!originStation || !destStation) {
      return res.status(404).json({ message: 'One or both stations were not found.' });
    }

    const distance = Math.abs(destStation.distanceFromColombo - originStation.distanceFromColombo);
    const rates = await FareRate.find();

    const comparison = rates.map(r => ({
      trainClass: r.trainClass,
      totalFare: Math.round(r.baseFare + distance * r.ratePerKm)
    }));

    res.json({ origin, destination, distanceKm: distance, comparison });
  } catch (err) {
    res.status(500).json({ message: 'Comparison failed. Please try again.' });
  }
};
