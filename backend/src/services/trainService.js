import { Train } from '../models/Train.js';
import { sampleTrains } from '../seed/seedData.js';
import mongoose from 'mongoose';

export const trainService = {
  async getAllTrains() {
    if (mongoose.connection.readyState === 1) {
      const trains = await Train.find({ active: true }).sort({ trainNumber: 1 });
      if (trains.length > 0) return trains;
    }
    return sampleTrains.map((t, idx) => ({ ...t, _id: `mock-train-${idx + 1}` }));
  },

  async getTrainById(id) {
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      return await Train.findById(id);
    }
    const all = await this.getAllTrains();
    return all.find((t) => t._id?.toString() === id || t.trainNumber === id || t.trainName.toLowerCase() === id.toLowerCase());
  },
};
