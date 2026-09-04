import api from './api';

export const trackingService = {
  async getLiveTrains() {
    const res = await api.get('/tracking/trains');
    return res.data?.data || [];
  },

  async getTrainTracking(id) {
    const res = await api.get(`/tracking/trains/${id}`);
    return res.data?.data;
  },

  async getTrackingRoutes() {
    const res = await api.get('/tracking/routes');
    return res.data?.data || [];
  },

  async getStations() {
    const res = await api.get('/tracking/stations');
    return res.data?.data || [];
  },

  async getTrackingStatus() {
    const res = await api.get('/tracking/status');
    return res.data?.data;
  },
};
