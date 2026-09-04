import mongoose from 'mongoose';
import { ISSUE_TYPES, ISSUE_SEVERITY, ISSUE_STATUS } from '../utils/constants.js';

const transportIssueSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    trainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      default: null,
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
      default: null,
    },
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
      default: null,
    },
    issueType: {
      type: String,
      enum: Object.values(ISSUE_TYPES),
      required: [true, 'Issue type is required'],
    },
    description: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    severity: {
      type: String,
      enum: Object.values(ISSUE_SEVERITY),
      default: ISSUE_SEVERITY.MEDIUM,
      required: [true, 'Severity is required'],
    },
    status: {
      type: String,
      enum: Object.values(ISSUE_STATUS),
      default: ISSUE_STATUS.UNDER_REVIEW,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TransportIssue = mongoose.model('TransportIssue', transportIssueSchema);
