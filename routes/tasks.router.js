import express from 'express';
import authorise from '../controllers/authentication.controller.js';
import { createTask, getTasks, updateTaskStatus } from '../controllers/tasks.controller.js';

const router = express.Router();

router.get('/tasks', authorise, getTasks);
router.post('/tasks', authorise, createTask);
router.patch('/tasks/:taskId/status', authorise, updateTaskStatus);

export default router;
