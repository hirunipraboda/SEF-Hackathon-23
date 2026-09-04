import api from './api';

export const bookingService = {
  async createBooking(bookingData) {
    const res = await api.post('/bookings', bookingData);
    return res.data?.data;
  },

  async getBookings(filter = {}) {
    const res = await api.get('/bookings', { params: filter });
    return res.data?.data || [];
  },

  async getBooking(id) {
    const res = await api.get(`/bookings/${id}`);
    return res.data?.data;
  },

  async cancelBooking(id) {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data?.data;
  },
};
