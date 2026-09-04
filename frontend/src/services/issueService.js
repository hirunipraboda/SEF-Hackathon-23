import api from './api';

export const issueService = {
  async getAllIssues(filter = {}) {
    const res = await api.get('/issues', { params: filter });
    return res.data?.data || [];
  },

  async getIssueById(id) {
    const res = await api.get(`/issues/${id}`);
    return res.data?.data;
  },

  async createIssue(issueData) {
    const res = await api.post('/issues', issueData);
    return res.data?.data;
  },

  async updateIssueStatus(id, status) {
    const res = await api.put(`/issues/${id}/status`, { status });
    return res.data?.data;
  },

  async deleteIssue(id) {
    const res = await api.delete(`/issues/${id}`);
    return res.data?.data;
  },
};
