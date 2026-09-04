import { issueService } from '../services/issueService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const getIssues = async (req, res, next) => {
  try {
    const { status, issueType } = req.query;
    const issues = await issueService.getAllIssues({ status, issueType });
    return sendSuccess(res, issues);
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const issue = await issueService.getIssueById(id);
    if (!issue) {
      return sendError(res, `Issue not found with ID or reportId '${id}'`, 404);
    }
    return sendSuccess(res, issue);
  } catch (error) {
    next(error);
  }
};

export const createIssue = async (req, res, next) => {
  try {
    const { trainId, routeId, stationId, issueType, description, severity } = req.body;
    const issue = await issueService.createIssue({
      trainId,
      routeId,
      stationId,
      issueType,
      description,
      severity,
    });
    return sendSuccess(res, issue, 201);
  } catch (error) {
    next(error);
  }
};

export const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await issueService.updateIssueStatus(id, status);
    return sendSuccess(res, updated);
  } catch (error) {
    next(error);
  }
};

export const deleteIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await issueService.deleteIssue(id);
    return sendSuccess(res, { message: 'Issue report deleted successfully', issue: deleted });
  } catch (error) {
    next(error);
  }
};
