import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updatePassword
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);

router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);

export default router;
