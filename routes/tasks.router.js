import express from 'express';
import authorise from '../controllers/authentication.controller.js';

const router = express.Router();

router.post('/tasks',authorise,);

export default router;