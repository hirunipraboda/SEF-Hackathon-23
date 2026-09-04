import { bookingService } from '../services/bookingService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const createBooking = async (req, res, next) => {
  try {
    const {
      scheduleId,
      originStationId,
      destinationStationId,
      travelDate,
      trainClass,
      passengers,
      passengerDetails,
    } = req.body;

    const booking = await bookingService.createBooking({
      scheduleId,
      originStationId,
      destinationStationId,
      travelDate,
      trainClass,
      passengers,
      passengerDetails,
    });

    return sendSuccess(res, booking, 201);
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const { bookingStatus, paymentStatus } = req.query;
    const bookings = await bookingService.getAllBookings({ bookingStatus, paymentStatus });
    return sendSuccess(res, bookings);
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return sendError(res, `Booking not found with ID or reference '${id}'`, 404);
    }
    return sendSuccess(res, booking);
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await bookingService.cancelBooking(id);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};
