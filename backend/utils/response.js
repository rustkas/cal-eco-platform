const createResponse = (success, data = null, message = '', statusCode = 200) => {
  const response = {
    success,
    ...(message && { message }),
    ...(data !== null && { data }),
  };
  return { response, statusCode };
};

const successResponse = (data = null, message = 'Success', statusCode = 200) => {
  return createResponse(true, data, message, statusCode);
};

const errorResponse = (message = 'Internal server error', statusCode = 500, data = null) => {
  return createResponse(false, data, message, statusCode);
};

const validationErrorResponse = (message = 'Validation error', data = null) => {
  return createResponse(false, data, message, 400);
};

const unauthorizedResponse = (message = 'Unauthorized') => {
  return createResponse(false, null, message, 401);
};

const forbiddenResponse = (message = 'Forbidden') => {
  return createResponse(false, null, message, 403);
};

const notFoundResponse = (message = 'Not found') => {
  return createResponse(false, null, message, 404);
};

// Helper to create error object for next(error) with compatible format
const createError = (message, statusCode = 500, data = null) => {
  const error = new Error(message);
  error.status = statusCode;
  error.message = message;
  error.msg = message; // For backward compatibility
  if (data) error.data = data;
  return error;
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  createResponse,
  createError,
};

