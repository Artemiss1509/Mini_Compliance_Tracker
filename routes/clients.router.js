import express from 'express';
import authorise from '../controllers/authentication.controller';

const router = express.Router();

router.post('/clients',authorise,)

export default router;