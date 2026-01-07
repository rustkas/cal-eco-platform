const logger = require('../utils/logger');

function errorMiddleware(error, req, res, next) {
  const { status = 500, message, msg, data } = error;

  // Use message or msg for compatibility
  const errorMessage = message || msg || 'Internal server error';
  const finalStatus = status === 500 && !message && !msg ? 500 : status;

  logger.error(`Error: ${errorMessage}`, {
    path: req.path,
    method: req.method,
    status: finalStatus,
    error: error.stack,
  });

  const finalMessage = finalStatus === 500 && !message && !msg ? 'Internal server error' : errorMessage;

  const errorResponse = {
    success: false,
    status: finalStatus,
    message: finalMessage,
    msg: finalMessage, // For backward compatibility with frontend
    ...(data && { data }),
  };

  res.status(finalStatus).json(errorResponse);
}

module.exports = errorMiddleware;
