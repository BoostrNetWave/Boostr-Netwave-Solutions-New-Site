/**
 * ApiError — Custom error class for structured, consistent error responses.
 *
 * Usage:
 *   throw new ApiError(404, "Service not found");
 *   throw new ApiError(400, "Validation failed", ["email is required", "phone is invalid"]);
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable error message
   * @param {Array}  errors     - Optional array of validation/field errors
   * @param {string} stack      - Optional stack trace (auto-captured if omitted)
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { ApiError };
