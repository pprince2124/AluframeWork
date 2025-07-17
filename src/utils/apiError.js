class apiError extends Error {
  constructor(
    statusCode,
    message = 'An error occurred',
    error = [],
    stake = '')
     {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.data = null;
    this.error = error;

    if (stake) {
      this.stake = stake;
    }else{
        Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default apiError;