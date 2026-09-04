import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import { PAYMENT_STATUS, BOOKING_STATUS, PAYMENT_METHODS } from '../utils/constants.js';
import mongoose from 'mongoose';

const generatePaymentReference = async () => {
  const currentYear = new Date().getFullYear();
  let unique = false;
  let reference = '';
  while (!unique) {
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
    reference = `PAY-${currentYear}-${randomSixDigits}`;
    const existing = await Payment.findOne({ paymentReference: reference });
    if (!existing) {
      unique = true;
    }
  }
  return reference;
};

export const paymentService = {
  async processPayment({ bookingId, demoCardNumber = '4242 4242 4242 4242', cardholderName = 'John Doe', method = PAYMENT_METHODS.DEMO_CARD }) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    if (!bookingId) {
      const err = new Error('A valid bookingId is required.');
      err.statusCode = 400;
      throw err;
    }

    // 1. Retrieve booking directly from database (ensuring amount integrity)
    let booking = null;
    if (mongoose.isValidObjectId(bookingId)) {
      booking = await Booking.findById(bookingId)
        .populate('train')
        .populate('route')
        .populate('originStation')
        .populate('destinationStation');
    }

    if (!booking) {
      booking = await Booking.findOne({ bookingReference: bookingId.toUpperCase().trim() })
        .populate('train')
        .populate('route')
        .populate('originStation')
        .populate('destinationStation');
    }

    if (!booking) {
      const err = new Error(`Booking not found with ID or reference '${bookingId}'.`);
      err.statusCode = 404;
      throw err;
    }

    // 2. Duplicate Payment Safeguard
    if (booking.bookingStatus === BOOKING_STATUS.CONFIRMED || booking.paymentStatus === PAYMENT_STATUS.PAID) {
      const err = new Error('Booking has already been paid.');
      err.statusCode = 400;
      throw err;
    }

    if (booking.bookingStatus === BOOKING_STATUS.CANCELLED) {
      const err = new Error('Cannot process payment for a cancelled booking.');
      err.statusCode = 400;
      throw err;
    }

    // 3. Extract authoritative amount from database record (tamper-proof)
    const amountToPay = booking.totalAmount;
    const cleanCard = (demoCardNumber || '').replace(/\s+/g, '');
    const cardLastFour = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';

    // 4. Evaluate Demo Outcome: Card ending in 0002 simulates a failed transaction
    const isSimulatedFailure = cleanCard.endsWith('0002');
    const paymentReference = await generatePaymentReference();

    if (isSimulatedFailure) {
      const failedPayment = new Payment({
        booking: booking._id,
        paymentReference,
        amount: amountToPay,
        currency: booking.currency || 'LKR',
        method,
        status: PAYMENT_STATUS.FAILED,
        transactionReference: `SIM-DECLINE-${Date.now()}`,
        cardLastFour,
        cardholderName: cardholderName || 'Cardholder',
        paidAt: null,
      });

      await failedPayment.save();

      // Keep booking in PENDING_PAYMENT state (do not confirm)
      booking.paymentStatus = PAYMENT_STATUS.FAILED;
      await booking.save();

      const err = new Error('Payment processing was declined by the simulated sandbox card issuer.');
      err.statusCode = 402; // Payment Required / Failed
      err.paymentDetails = failedPayment;
      throw err;
    }

    // 5. Successful Payment Flow
    const successfulPayment = new Payment({
      booking: booking._id,
      paymentReference,
      amount: amountToPay,
      currency: booking.currency || 'LKR',
      method,
      status: PAYMENT_STATUS.PAID,
      transactionReference: `SIM-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      cardLastFour,
      cardholderName: cardholderName || 'Authorized Commuter',
      paidAt: new Date(),
    });

    const savedPayment = await successfulPayment.save();

    // 6. Confirm Booking
    booking.bookingStatus = BOOKING_STATUS.CONFIRMED;
    booking.paymentStatus = PAYMENT_STATUS.PAID;
    booking.paymentId = savedPayment._id;
    const updatedBooking = await booking.save();

    return {
      payment: savedPayment,
      booking: updatedBooking,
      message: 'Payment simulated successfully. Booking is now confirmed.',
    };
  },

  async getPaymentById(id) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    let payment = null;
    if (mongoose.isValidObjectId(id)) {
      payment = await Payment.findById(id).populate('booking');
    }
    if (!payment) {
      payment = await Payment.findOne({ paymentReference: id.toUpperCase().trim() }).populate('booking');
    }
    return payment;
  },

  async getPaymentByBooking(bookingId) {
    if (mongoose.connection.readyState !== 1) {
      return null;
    }

    let resolvedBookingId = bookingId;
    if (!mongoose.isValidObjectId(bookingId)) {
      const b = await Booking.findOne({ bookingReference: bookingId.toUpperCase().trim() });
      if (b) resolvedBookingId = b._id;
    }

    return await Payment.findOne({ booking: resolvedBookingId }).sort({ createdAt: -1 });
  },
};
