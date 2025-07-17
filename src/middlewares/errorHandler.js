import ApiError from '../utils/apiError.js';

/** Global error handler (last middleware) */
export default (err, _req, res, _next) => {
  // Convert unknown errors to ApiError
  if (!(err instanceof ApiError)) {
    console.error(err.stack);
    err = new ApiError(500, err.message || 'Server error');
  }
  res.status(err.statusCode).json({
    message: err.message,
    errors: err.errors || null
  });
};
