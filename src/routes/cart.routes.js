// src/routes/cart.routes.js
import express from 'express';
import { protect } from '../middlewares/auth.js';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller.js';

const router = express.Router();
router.use(protect); // must be logged in

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

export default router;

