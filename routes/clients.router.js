import express from 'express';
import authorise from '../controllers/authentication.controller.js';
import { createClient, getClients } from '../controllers/clients.controller.js';

const router = express.Router();

router.post('/',authorise,createClient);
router.get('/all',authorise, getClients);

export default router;