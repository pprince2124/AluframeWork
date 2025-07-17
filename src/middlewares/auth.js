import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { ServiceAgent } from '../models/serviceAgentModel.js';
import ApiError from '../utils/apiError.js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized: No token provided'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    let account;

    if (role === 'vendor') {
      account = await ServiceAgent.findById(id).select('-password');
    } else {
      account = await User.findById(id).select('-password');
    }

    if (!account) {
      return next(new ApiError(401, 'Unauthorized: Account not found'));
    }

    req.user = account;
    req.user.role = role;
    req.user.id = id;

    next();
  } catch (err) {
    return next(new ApiError(401, 'Unauthorized: Invalid token'));
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: Access denied'));
    }
    next();
  };
};
