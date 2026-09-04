import { TransportIssue } from '../models/TransportIssue.js';
import { ISSUE_TYPES, ISSUE_SEVERITY, ISSUE_STATUS } from '../utils/constants.js';
import mongoose from 'mongoose';

const generateReportId = () => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TT-${randomSuffix}`;
};

export const issueService = {
  async getAllIssues(filter = {}) {
    if (mongoose.connection.readyState === 1) {
      const query = {};
      if (filter.status && Object.values(ISSUE_STATUS).includes(filter.status)) {
        query.status = filter.status;
      }
      if (filter.issueType && Object.values(ISSUE_TYPES).includes(filter.issueType)) {
        query.issueType = filter.issueType;
      }
      return await TransportIssue.find(query)
        .populate('trainId')
        .populate('routeId')
        .populate('stationId')
        .sort({ createdAt: -1 });
    }
    return [];
  },

  async getIssueById(id) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    let issue = null;
    if (mongoose.isValidObjectId(id)) {
      issue = await TransportIssue.findById(id)
        .populate('trainId')
        .populate('routeId')
        .populate('stationId');
    }
    if (!issue) {
      issue = await TransportIssue.findOne({ reportId: id.toUpperCase() })
        .populate('trainId')
        .populate('routeId')
        .populate('stationId');
    }
    return issue;
  },

  async createIssue({ trainId, routeId, stationId, issueType, description, severity = ISSUE_SEVERITY.MEDIUM }) {
    if (!issueType || !Object.values(ISSUE_TYPES).includes(issueType)) {
      const err = new Error(`Valid issueType is required. Must be one of: ${Object.values(ISSUE_TYPES).join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    if (!description || description.trim().length < 5) {
      const err = new Error('Issue description must be at least 5 characters.');
      err.statusCode = 400;
      throw err;
    }

    if (!Object.values(ISSUE_SEVERITY).includes(severity)) {
      const err = new Error(`Valid severity is required. Must be one of: ${Object.values(ISSUE_SEVERITY).join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected. Cannot persist issue report.');
      err.statusCode = 503;
      throw err;
    }

    // Generate unique reportId
    let reportId = generateReportId();
    let existing = await TransportIssue.findOne({ reportId });
    while (existing) {
      reportId = generateReportId();
      existing = await TransportIssue.findOne({ reportId });
    }

    let resolvedTrainId = trainId;
    if (trainId && !mongoose.isValidObjectId(trainId)) {
      const train = await mongoose.model('Train').findOne({ trainNumber: trainId });
      resolvedTrainId = train ? train._id : null;
    }

    const issue = new TransportIssue({
      reportId,
      trainId: (resolvedTrainId && mongoose.isValidObjectId(resolvedTrainId)) ? resolvedTrainId : null,
      routeId: (routeId && mongoose.isValidObjectId(routeId)) ? routeId : null,
      stationId: (stationId && mongoose.isValidObjectId(stationId)) ? stationId : null,
      issueType,
      description: description.trim(),
      severity,
      status: ISSUE_STATUS.UNDER_REVIEW,
    });

    return await issue.save();
  },

  async updateIssueStatus(id, newStatus) {
    if (!newStatus || !Object.values(ISSUE_STATUS).includes(newStatus)) {
      const err = new Error(`Valid status is required. Must be one of: ${Object.values(ISSUE_STATUS).join(', ')}.`);
      err.statusCode = 400;
      throw err;
    }

    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    const issue = await this.getIssueById(id);
    if (!issue) {
      const err = new Error(`Issue not found with ID or reportId '${id}'`);
      err.statusCode = 404;
      throw err;
    }

    issue.status = newStatus;
    return await issue.save();
  },

  async deleteIssue(id) {
    if (mongoose.connection.readyState !== 1) {
      const err = new Error('Database is not connected');
      err.statusCode = 503;
      throw err;
    }

    let deleted = null;
    if (mongoose.isValidObjectId(id)) {
      deleted = await TransportIssue.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await TransportIssue.findOneAndDelete({ reportId: id.toUpperCase() });
    }

    if (!deleted) {
      const err = new Error(`Issue not found with ID or reportId '${id}'`);
      err.statusCode = 404;
      throw err;
    }

    return deleted;
  },
};
