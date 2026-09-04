import { Fare } from '../models/Fare.js';
import { Station } from '../models/Station.js';
import { TRAIN_CLASSES, PASSENGER_TYPES } from '../utils/constants.js';
import mongoose from 'mongoose';

export const fareService = {
  async getAllFares() {
    if (mongoose.connection.readyState === 1) {
      return await Fare.find().populate('originStation').populate('destinationStation');
    }
    return [];
  },

  async calculateFare({ origin, destination, passengerType = PASSENGER_TYPES.ADULT, trainClass = TRAIN_CLASSES.SECOND, passengers = 1 }) {
    // 1. Validate missing stations
    if (!origin || !origin.trim()) {
      const err = new Error('Departure station (origin) is required.');
      err.statusCode = 400;
      throw err;
    }
    if (!destination || !destination.trim()) {
      const err = new Error('Destination station is required.');
      err.statusCode = 400;
      throw err;
    }

    // 2. Validate same origin and destination
    if (origin.trim().toLowerCase() === destination.trim().toLowerCase()) {
      const err = new Error('Departure and destination stations cannot be the same.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Validate passenger count
    const numPassengers = Number(passengers);
    if (!Number.isInteger(numPassengers) || numPassengers <= 0) {
      const err = new Error('Number of passengers must be an integer greater than 0.');
      err.statusCode = 400;
      throw err;
    }

    // 4. Validate train class
    const validClasses = Object.values(TRAIN_CLASSES);
    const upperClass = trainClass ? trainClass.toUpperCase() : '';
    if (!validClasses.includes(upperClass)) {
      const err = new Error(`Invalid train class '${trainClass}'. Must be one of: ${validClasses.join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    // 5. Validate passenger type
    const validPassengerTypes = Object.values(PASSENGER_TYPES);
    const upperType = passengerType ? passengerType.toUpperCase() : '';
    if (!validPassengerTypes.includes(upperType)) {
      const err = new Error(`Invalid passenger type '${passengerType}'. Must be one of: ${validPassengerTypes.join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not currently connected. Please configure MongoDB.');
      err.statusCode = 503;
      throw err;
    }

    // Resolve stations by name or code
    const originRegex = new RegExp(`^${origin.trim()}$`, 'i');
    const destRegex = new RegExp(`^${destination.trim()}$`, 'i');

    const [originStation, destStation] = await Promise.all([
      Station.findOne({ $or: [{ name: originRegex }, { code: originRegex }] }),
      Station.findOne({ $or: [{ name: destRegex }, { code: destRegex }] }),
    ]);

    if (!originStation) {
      const err = new Error(`Departure station '${origin}' was not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (!destStation) {
      const err = new Error(`Destination station '${destination}' was not found.`);
      err.statusCode = 404;
      throw err;
    }

    // Find direct fare or reversed fare
    let fareRecord = await Fare.findOne({
      originStation: originStation._id,
      destinationStation: destStation._id,
      trainClass: upperClass,
      passengerType: upperType,
    });

    // Also check reverse if bidirectional
    if (!fareRecord) {
      fareRecord = await Fare.findOne({
        originStation: destStation._id,
        destinationStation: originStation._id,
        trainClass: upperClass,
        passengerType: upperType,
      });
    }

    if (!fareRecord) {
      const err = new Error(`No fare information found between '${originStation.name}' and '${destStation.name}' for class '${upperClass}' and passenger type '${upperType}'.`);
      err.statusCode = 404;
      throw err;
    }

    const farePerPassenger = fareRecord.amount;
    const totalFare = farePerPassenger * numPassengers;

    return {
      origin: originStation.name,
      destination: destStation.name,
      trainClass: upperClass,
      passengerType: upperType,
      farePerPassenger,
      passengers: numPassengers,
      totalFare,
      currency: 'LKR',
    };
  },
};
