import api from './api';

export const paymentService = {
  async createPayment({ bookingId, demoCardNumber, cardholderName, method }) {
    const res = await api.post('/payments/create', {
      bookingId,
      demoCardNumber,
      cardholderName,
      method,
    });
    return res.data?.data;
  },

  async getPayment(id) {
    const res = await api.get(`/payments/${id}`);
    return res.data?.data;
  },

  async getPaymentByBooking(bookingId) {
    const res = await api.get(`/payments/booking/${bookingId}`);
    return res.data?.data;
  },
};
