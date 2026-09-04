import { Booking } from '../models/Booking.js';
import { Schedule } from '../models/Schedule.js';
import { Station } from '../models/Station.js';
import { fareService } from './fareService.js';
import { TRAIN_CLASSES, BOOKING_STATUS, PAYMENT_STATUS, TRAIN_STATUS } from '../utils/constants.js';
import mongoose from 'mongoose';

const generateBookingReference = async () => {
  const currentYear = new Date().getFullYear();
  let unique = false;
  let reference = '';
  while (!unique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    reference = `TL-${currentYear}-${randomSixDigits}`;
    const existing = await Booking.findOne({ bookingReference: reference });
    if (!existing) {
      unique = true;
    }
  }
  return reference;
};

export const bookingService = {
  async getAllBookings(filter = {}) {
    if (mongoose.connection.readyState !== 1) {
      return [];
    }

    const query = {};
    if (filter.bookingStatus && Object.values(BOOKING_STATUS).includes(filter.bookingStatus)) {
      query.bookingStatus = filter.bookingStatus;
    }
    if (filter.paymentStatus && Object.values(PAYMENT_STATUS).includes(filter.paymentStatus)) {
      query.paymentStatus = filter.paymentStatus;
    }

    return await Booking.find(query)
      .populate('train')
      .populate('route')
      .populate('schedule')
      .populate('originStation')
      .populate('destinationStation')
      .populate('paymentId')
      .sort({ createdAt: -1 });
  },

  async getBookingById(id) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    let booking = null;
    if (mongoose.isValidObjectId(id)) {
      booking = await Booking.findById(id)
        .populate('train')
        .populate('route')
        .populate('schedule')
        .populate('originStation')
        .populate('destinationStation')
        .populate('paymentId');
    }

    if (!booking) {
      booking = await Booking.findOne({ bookingReference: id.toUpperCase().trim() })
        .populate('train')
        .populate('route')
        .populate('schedule')
        .populate('originStation')
        .populate('destinationStation')
        .populate('paymentId');
    }

    return booking;
  },

  async createBooking({
    scheduleId,
    originStationId,
    destinationStationId,
    travelDate,
    trainClass = TRAIN_CLASSES.SECOND,
    passengers = 1,
    passengerDetails = [],
  }) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    // 1. Validate Schedule ID
    if (!scheduleId || !mongoose.isValidObjectId(scheduleId)) {
      const err = new Error('A valid railway scheduleId is required.');
      err.statusCode = 400;
      throw err;
    }

    const schedule = await Schedule.findById(scheduleId)
      .populate('trainId')
      .populate({
        path: 'routeId',
        populate: [{ path: 'originStation' }, { path: 'destinationStation' }],
      });

    if (!schedule) {
      const err = new Error(`Schedule not found with ID '${scheduleId}'.`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Validate Train and Schedule Status (Cancelled protection)
    const train = schedule.trainId;
    if (
      schedule.status === TRAIN_STATUS.CANCELLED ||
      (train && train.status === TRAIN_STATUS.CANCELLED)
    ) {
      const err = new Error('Booking unavailable. This train has been cancelled.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Resolve Origin & Destination Stations
    let originStation = null;
    let destinationStation = null;

    if (originStationId && mongoose.isValidObjectId(originStationId)) {
      originStation = await Station.findById(originStationId);
    } else if (originStationId) {
      originStation = await Station.findOne({
        $or: [{ name: new RegExp(`^${originStationId.trim()}$`, 'i') }, { code: originStationId.trim().toUpperCase() }],
      });
    } else if (schedule.routeId?.originStation) {
      originStation = schedule.routeId.originStation;
    }

    if (destinationStationId && mongoose.isValidObjectId(destinationStationId)) {
      destinationStation = await Station.findById(destinationStationId);
    } else if (destinationStationId) {
      destinationStation = await Station.findOne({
        $or: [{ name: new RegExp(`^${destinationStationId.trim()}$`, 'i') }, { code: destinationStationId.trim().toUpperCase() }],
      });
    } else if (schedule.routeId?.destinationStation) {
      destinationStation = schedule.routeId.destinationStation;
    }

    if (!originStation || !destinationStation) {
      const err = new Error('Valid origin and destination stations are required.');
      err.statusCode = 400;
      throw err;
    }

    // 4. Validate Same Origin & Destination
    if (originStation._id.toString() === destinationStation._id.toString()) {
      const err = new Error('Origin and destination stations cannot be the same.');
      err.statusCode = 400;
      throw err;
    }

    // 5. Validate Travel Date (not in the past)
    if (!travelDate) {
      const err = new Error('Travel date is required.');
      err.statusCode = 400;
      throw err;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const travelDateStr = new Date(travelDate).toISOString().split('T')[0];
    if (travelDateStr < todayStr) {
      const err = new Error('Travel date cannot be in the past.');
      err.statusCode = 400;
      throw err;
    }

    // 6. Validate Train Class
    const upperClass = trainClass ? trainClass.toUpperCase() : '';
    if (!Object.values(TRAIN_CLASSES).includes(upperClass)) {
      const err = new Error(`Invalid train class '${trainClass}'. Must be one of: ${Object.values(TRAIN_CLASSES).join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    // 7. Validate Passenger Count
    const numPassengers = Number(passengers);
    if (!Number.isInteger(numPassengers) || numPassengers < 1 || numPassengers > 10) {
      const err = new Error('Passenger count must be an integer between 1 and 10.');
      err.statusCode = 400;
      throw err;
    }

    // 8. Validate Passenger Details (at least first passenger name)
    const validPassengerDetails = Array.isArray(passengerDetails) ? passengerDetails : [];
    if (validPassengerDetails.length > 0 && !validPassengerDetails[0]?.name) {
      const err = new Error('Primary passenger full name is required.');
      err.statusCode = 400;
      throw err;
    }

    // 9. Authoritative Backend Fare Calculation (never trust client amounts)
    const calculated = await fareService.calculateFare({
      origin: originStation.name,
      destination: destinationStation.name,
      trainClass: upperClass,
      passengers: numPassengers,
    });

    const farePerPassenger = calculated.farePerPassenger;
    const subtotal = calculated.totalFare;
    const serviceFee = 0;
    const totalAmount = subtotal + serviceFee;

    // 10. Generate Unique Booking Reference
    const bookingReference = await generateBookingReference();

    // 11. Create Booking Record
    const newBooking = new Booking({
      bookingReference,
      train: train ? train._id : schedule.trainId,
      route: schedule.routeId._id || schedule.routeId,
      schedule: schedule._id,
      originStation: originStation._id,
      destinationStation: destinationStation._id,
      travelDate: travelDateStr,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      trainClass: upperClass,
      passengers: numPassengers,
      passengerDetails: validPassengerDetails,
      farePerPassenger,
      subtotal,
      serviceFee,
      totalAmount,
      currency: 'LKR',
      bookingStatus: BOOKING_STATUS.PENDING_PAYMENT,
      paymentStatus: PAYMENT_STATUS.PENDING,
      paymentId: null,
    });

    const saved = await newBooking.save();

    return await Booking.findById(saved._id)
      .populate('train')
      .populate('route')
      .populate('schedule')
      .populate('originStation')
      .populate('destinationStation');
  },

  async cancelBooking(id) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    const booking = await this.getBookingById(id);
    if (!booking) {
      const err = new Error(`Booking not found with ID or reference '${id}'.`);
      err.statusCode = 404;
      throw err;
    }

    if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
      const err = new Error('This booking is already cancelled.');
      err.statusCode = 400;
      throw err;
    }

    booking.bookingStatus = BOOKING_STATUS.CANCELLED;
    const updated = await booking.save();

    return {
      booking: updated,
      message:
        'Cancellation recorded. Refund processing is not implemented in the current MVP.',
    };
  },
};
