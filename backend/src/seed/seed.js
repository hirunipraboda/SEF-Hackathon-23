import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { Station } from '../models/Station.js';
import { Train } from '../models/Train.js';
import { Route } from '../models/Route.js';
import { Schedule } from '../models/Schedule.js';
import { Fare } from '../models/Fare.js';
import { TransportIssue } from '../models/TransportIssue.js';
import { Feedback } from '../models/Feedback.js';
import { sampleStations, sampleTrains, sampleIssuesData, sampleFeedbackData } from './seedData.js';
import { TRAIN_CLASSES, PASSENGER_TYPES } from '../utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<username>') || uri === 'your_mongodb_connection_string') {
    console.error('❌ MONGODB_URI is not configured in .env. Please provide a valid MongoDB connection string.');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB successfully.');

    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      Station.deleteMany({}),
      Train.deleteMany({}),
      Route.deleteMany({}),
      Schedule.deleteMany({}),
      Fare.deleteMany({}),
      TransportIssue.deleteMany({}),
      Feedback.deleteMany({}),
    ]);

    console.log('🚉 Inserting stations...');
    const insertedStations = await Station.insertMany(sampleStations);
    const stationMap = {};
    insertedStations.forEach((s) => {
      stationMap[s.name] = s;
    });

    console.log('🚆 Inserting trains...');
    const insertedTrains = await Train.insertMany(sampleTrains);
    const trainMap = {};
    insertedTrains.forEach((t) => {
      trainMap[t.trainName] = t;
    });

    console.log('🗺️ Creating routes...');
    // Route 1: Colombo Fort -> Kandy (Main Line)
    const colombo = stationMap['Colombo Fort'];
    const maradana = stationMap['Maradana'];
    const ragama = stationMap['Ragama'];
    const gampaha = stationMap['Gampaha'];
    const polgahawela = stationMap['Polgahawela'];
    const kandy = stationMap['Kandy'];
    const galle = stationMap['Galle'];
    const matara = stationMap['Matara'];
    const anuradhapura = stationMap['Anuradhapura'];
    const jaffna = stationMap['Jaffna'];

    const routesToInsert = [
      {
        trainId: trainMap['Podi Menike']._id,
        originStation: colombo._id,
        destinationStation: kandy._id,
        duration: '3h 10m',
        distance: 120,
        stops: [
          { station: colombo._id, stopOrder: 1, arrivalTime: '05:55', departureTime: '05:55', distanceFromOrigin: 0 },
          { station: maradana._id, stopOrder: 2, arrivalTime: '06:01', departureTime: '06:03', distanceFromOrigin: 3 },
          { station: ragama._id, stopOrder: 3, arrivalTime: '06:22', departureTime: '06:24', distanceFromOrigin: 16 },
          { station: gampaha._id, stopOrder: 4, arrivalTime: '06:36', departureTime: '06:38', distanceFromOrigin: 28 },
          { station: polgahawela._id, stopOrder: 5, arrivalTime: '07:22', departureTime: '07:26', distanceFromOrigin: 74 },
          { station: kandy._id, stopOrder: 6, arrivalTime: '09:05', departureTime: '09:05', distanceFromOrigin: 120 },
        ],
      },
      {
        trainId: trainMap['Udarata Menike']._id,
        originStation: colombo._id,
        destinationStation: kandy._id,
        duration: '2h 55m',
        distance: 120,
        stops: [
          { station: colombo._id, stopOrder: 1, arrivalTime: '08:30', departureTime: '08:30', distanceFromOrigin: 0 },
          { station: polgahawela._id, stopOrder: 2, arrivalTime: '09:45', departureTime: '09:48', distanceFromOrigin: 74 },
          { station: kandy._id, stopOrder: 3, arrivalTime: '11:25', departureTime: '11:25', distanceFromOrigin: 120 },
        ],
      },
      {
        trainId: trainMap['Ruhunu Kumari']._id,
        originStation: colombo._id,
        destinationStation: matara._id,
        duration: '2h 45m',
        distance: 160,
        stops: [
          { station: colombo._id, stopOrder: 1, arrivalTime: '06:50', departureTime: '06:50', distanceFromOrigin: 0 },
          { station: galle._id, stopOrder: 2, arrivalTime: '08:45', departureTime: '08:50', distanceFromOrigin: 115 },
          { station: matara._id, stopOrder: 3, arrivalTime: '09:35', departureTime: '09:35', distanceFromOrigin: 160 },
        ],
      },
      {
        trainId: trainMap['Yal Devi']._id,
        originStation: colombo._id,
        destinationStation: jaffna._id,
        duration: '6h 30m',
        distance: 398,
        stops: [
          { station: colombo._id, stopOrder: 1, arrivalTime: '05:45', departureTime: '05:45', distanceFromOrigin: 0 },
          { station: polgahawela._id, stopOrder: 2, arrivalTime: '07:05', departureTime: '07:08', distanceFromOrigin: 74 },
          { station: anuradhapura._id, stopOrder: 3, arrivalTime: '09:20', departureTime: '09:25', distanceFromOrigin: 206 },
          { station: jaffna._id, stopOrder: 4, arrivalTime: '12:15', departureTime: '12:15', distanceFromOrigin: 398 },
        ],
      },
    ];

    const insertedRoutes = await Route.insertMany(routesToInsert);

    console.log('📅 Inserting schedules...');
    const schedulesToInsert = [
      {
        trainId: trainMap['Podi Menike']._id,
        routeId: insertedRoutes[0]._id,
        departureTime: '05:55',
        arrivalTime: '09:05',
        operatingDays: ['DAILY'],
        status: 'ON_TIME',
      },
      {
        trainId: trainMap['Udarata Menike']._id,
        routeId: insertedRoutes[1]._id,
        departureTime: '08:30',
        arrivalTime: '11:25',
        operatingDays: ['DAILY'],
        status: 'ON_TIME',
      },
      {
        trainId: trainMap['Ruhunu Kumari']._id,
        routeId: insertedRoutes[2]._id,
        departureTime: '06:50',
        arrivalTime: '09:35',
        operatingDays: ['DAILY'],
        status: 'DELAYED',
      },
      {
        trainId: trainMap['Yal Devi']._id,
        routeId: insertedRoutes[3]._id,
        departureTime: '05:45',
        arrivalTime: '12:15',
        operatingDays: ['DAILY'],
        status: 'ON_TIME',
      },
    ];
    await Schedule.insertMany(schedulesToInsert);

    console.log('💳 Inserting fare tables...');
    const faresToInsert = [
      // Colombo -> Kandy
      { originStation: colombo._id, destinationStation: kandy._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.ADULT, amount: 1500 },
      { originStation: colombo._id, destinationStation: kandy._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.ADULT, amount: 600 },
      { originStation: colombo._id, destinationStation: kandy._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.ADULT, amount: 300 },
      { originStation: colombo._id, destinationStation: kandy._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.CHILD, amount: 900 },
      { originStation: colombo._id, destinationStation: kandy._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.CHILD, amount: 350 },
      { originStation: colombo._id, destinationStation: kandy._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.CHILD, amount: 180 },

      // Colombo -> Galle
      { originStation: colombo._id, destinationStation: galle._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.ADULT, amount: 1200 },
      { originStation: colombo._id, destinationStation: galle._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.ADULT, amount: 500 },
      { originStation: colombo._id, destinationStation: galle._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.ADULT, amount: 240 },
      { originStation: colombo._id, destinationStation: galle._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.CHILD, amount: 700 },
      { originStation: colombo._id, destinationStation: galle._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.CHILD, amount: 280 },
      { originStation: colombo._id, destinationStation: galle._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.CHILD, amount: 140 },

      // Colombo -> Matara
      { originStation: colombo._id, destinationStation: matara._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.ADULT, amount: 1600 },
      { originStation: colombo._id, destinationStation: matara._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.ADULT, amount: 650 },
      { originStation: colombo._id, destinationStation: matara._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.ADULT, amount: 320 },
      { originStation: colombo._id, destinationStation: matara._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.CHILD, amount: 950 },
      { originStation: colombo._id, destinationStation: matara._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.CHILD, amount: 380 },
      { originStation: colombo._id, destinationStation: matara._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.CHILD, amount: 190 },

      // Colombo -> Jaffna
      { originStation: colombo._id, destinationStation: jaffna._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.ADULT, amount: 2800 },
      { originStation: colombo._id, destinationStation: jaffna._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.ADULT, amount: 1400 },
      { originStation: colombo._id, destinationStation: jaffna._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.ADULT, amount: 680 },
      { originStation: colombo._id, destinationStation: jaffna._id, trainClass: TRAIN_CLASSES.FIRST, passengerType: PASSENGER_TYPES.CHILD, amount: 1600 },
      { originStation: colombo._id, destinationStation: jaffna._id, trainClass: TRAIN_CLASSES.SECOND, passengerType: PASSENGER_TYPES.CHILD, amount: 800 },
      { originStation: colombo._id, destinationStation: jaffna._id, trainClass: TRAIN_CLASSES.THIRD, passengerType: PASSENGER_TYPES.CHILD, amount: 400 },
    ];
    await Fare.insertMany(faresToInsert);

    console.log('⚠️ Inserting transport issues...');
    const issuesWithRefs = sampleIssuesData.map((issue, idx) => ({
      ...issue,
      trainId: insertedTrains[idx % insertedTrains.length]._id,
      routeId: insertedRoutes[idx % insertedRoutes.length]._id,
      stationId: insertedStations[idx % insertedStations.length]._id,
    }));
    await TransportIssue.insertMany(issuesWithRefs);

    console.log('⭐ Inserting passenger feedback...');
    const feedbackWithRefs = sampleFeedbackData.map((fb, idx) => ({
      ...fb,
      trainId: insertedTrains[idx % insertedTrains.length]._id,
      routeId: insertedRoutes[idx % insertedRoutes.length]._id,
    }));
    await Feedback.insertMany(feedbackWithRefs);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
