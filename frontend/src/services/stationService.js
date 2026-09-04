import api from './api';

export const stationService = {
  async getAllStations() {
    const res = await api.get('/stations');
    return res.data?.data || [];
  },

  async getStationById(id) {
    const res = await api.get(`/stations/${id}`);
    return res.data?.data;
  },
};
