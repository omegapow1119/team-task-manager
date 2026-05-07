import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  deleteProject
} from '../controllers/projectController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .delete(protect, deleteProject);

router.route('/:id/members')
  .put(protect, addMember);

export default router;
