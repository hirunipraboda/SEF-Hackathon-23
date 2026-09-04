import { paymentService } from '../services/paymentService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const createPayment = async (req, res, next) => {
  try {
    const { bookingId, demoCardNumber, cardholderName, method } = req.body;
    const result = await paymentService.processPayment({
      bookingId,
      demoCardNumber,
      cardholderName,
      method,
    });
    return sendSuccess(res, result, 201);
  } catch (error) {
    if (error.statusCode === 402 && error.paymentDetails) {
      return res.status(402).json({
        success: false,
        message: error.message,
        data: {
          payment: error.paymentDetails,
        },
      });
    }
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id);
    if (!payment) {
      return sendError(res, `Payment not found with ID or reference '${id}'`, 404);
    }
    return sendSuccess(res, payment);
  } catch (error) {
    next(error);
  }
};

export const getPaymentByBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const payment = await paymentService.getPaymentByBooking(bookingId);
    if (!payment) {
      return sendError(res, `No payment found for booking '${bookingId}'`, 404);
    }
    return sendSuccess(res, payment);
  } catch (error) {
    next(error);
  }
};
