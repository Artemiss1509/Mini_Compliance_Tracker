import express from 'express';
import authorise from '../controllers/authentication.controller';

const router = express.Router();

router.post('/tasks',authorise,);

export default router;