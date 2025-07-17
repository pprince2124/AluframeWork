// src/controllers/cart.controller.js
import { Cart } from '../models/cart.model.js';
import ApiError from '../utils/apiError.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/* 🛒 Get Cart for Logged-in User */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.serviceId items.vendorId');
  res.json(new ApiResponse(200, cart || { items: [] }, 'Cart retrieved'));
});

/* ➕ Add Item to Cart */
export const addToCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }) || new Cart({ user: req.user._id });
  await cart.addItem(req.body);
  res.status(200).json(new ApiResponse(200, cart, 'Item added to cart'));
});

/* ❌ Remove Item by serviceId */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { serviceId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  await cart.removeItem(serviceId);
  res.json(new ApiResponse(200, cart, 'Item removed'));
});

/* 🗑️ Clear Cart */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, 'Cart not found');
  await cart.clearCart();
  res.json(new ApiResponse(200, {}, 'Cart cleared'));
});
