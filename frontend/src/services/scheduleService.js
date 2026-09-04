import api from './api';

export const scheduleService = {
  async getAllSchedules() {
    const res = await api.get('/schedules');
    return res.data?.data || [];
  },

  async searchSchedules({ from, to, date, trainType, sortBy }) {
    const params = { from, to };
    if (date) params.date = date;
    if (trainType) params.trainType = trainType;
    if (sortBy) params.sortBy = sortBy;

    const res = await api.get('/schedules/search', { params });
    return res.data?.data || [];
  },
};
