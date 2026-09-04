import { Router } from 'express';
import { getIssues, getIssueById, createIssue, updateIssueStatus, deleteIssue } from '../controllers/issueController.js';

const router = Router();

router.get('/', getIssues);
router.post('/', createIssue);
router.get('/:id', getIssueById);
router.put('/:id/status', updateIssueStatus);
router.delete('/:id', deleteIssue);

export default router;
