import { scheduleService } from '../services/scheduleService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getAllSchedules();
    return sendSuccess(res, schedules);
  } catch (error) {
    next(error);
  }
};

export const searchSchedules = async (req, res, next) => {
  try {
    const { from, to, date, trainType, sortBy } = req.query;
    if (!from || !to) {
      return sendError(res, 'Both departure station (from) and destination station (to) are required.', 400);
    }
    const schedules = await scheduleService.searchSchedules({ from, to, date, trainType, sortBy });
    return sendSuccess(res, schedules, 200, {
      count: schedules.length,
      from,
      to,
      date: date || null,
    });
  } catch (error) {
    next(error);
  }
};
