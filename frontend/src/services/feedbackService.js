import api from './api';

export const feedbackService = {
  async getAllFeedback(filter = {}) {
    const res = await api.get('/feedback', { params: filter });
    return res.data?.data || [];
  },

  async getFeedbackByTrain(trainId) {
    const res = await api.get(`/feedback/train/${trainId}`);
    return res.data?.data || [];
  },

  async getFeedbackSummary(trainId) {
    const res = await api.get(`/feedback/summary/${trainId}`);
    return res.data?.data;
  },

  async createFeedback(feedbackData) {
    const res = await api.post('/feedback', feedbackData);
    return res.data?.data;
  },
};
