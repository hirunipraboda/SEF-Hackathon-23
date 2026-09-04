import api from './api';

export const fareService = {
  async getAllFares() {
    const res = await api.get('/fares');
    return res.data?.data || [];
  },

  async calculateFare({ origin, destination, passengerType = 'ADULT', trainClass = 'SECOND', passengers = 1 }) {
    const res = await api.post('/fares/calculate', {
      origin,
      destination,
      passengerType,
      trainClass,
      passengers,
    });
    return res.data?.data;
  },
};
