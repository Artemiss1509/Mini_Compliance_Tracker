import express from 'express';
import { signUp, signIn } from '../controllers/user.controller.js';
const router = express.Router();

router.post('/signup',signUp);
router.post('/sign-in',signIn);

export default router;