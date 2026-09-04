import api from './api';

export const trainService = {
  async getAllTrains() {
    const res = await api.get('/trains');
    return res.data?.data || [];
  },

  async getTrainById(id) {
    const res = await api.get(`/trains/${id}`);
    return res.data?.data;
  },
};
