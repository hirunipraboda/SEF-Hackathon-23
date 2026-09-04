import api from './api';

export const routeService = {
  async getAllRoutes() {
    const res = await api.get('/routes');
    return res.data?.data || [];
  },

  async getRouteById(id) {
    const res = await api.get(`/routes/${id}`);
    return res.data?.data;
  },
};
