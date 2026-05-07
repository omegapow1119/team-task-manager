import express from 'express';
import {
  createTask,
  getDashboardTasks,
  getProjectTasks,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardTasks);
router.get('/project/:projectId', protect, getProjectTasks);

router.route('/')
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
