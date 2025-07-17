// src/routes/user.routes.js
import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateUser,
  deleteUser,
  listUsers,
  myBookings
} from '../controllers/user.controller.js';


import {
  registerValidator,
  loginValidator
} from '../middlewares/validators/userValidator.js';   // ← exact path & names

import { protect, restrictTo } from '../middlewares/auth.js';
// 
const router = Router();

/* public */
router.post('/register', registerValidator, register);
router.post('/login',    loginValidator,    login);

/* protected */
router.use(protect);
router.get('/me',           getMe);
router.patch('/:id',        updateUser);
router.get('/my-bookings',  myBookings);

/* admin */
router.use(restrictTo('admin'));
router.get('/',     listUsers);
router.delete('/:id', deleteUser);

export default router;
