class appError extends Error {
  constructor(statusCode, message, data = null, error = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.data = data;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default appError;
