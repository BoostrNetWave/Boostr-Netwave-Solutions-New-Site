/**
 * ApiResponse — Standardized success response shape.
 * Every successful API response uses this wrapper so the frontend
 * always receives a consistent { success, statusCode, message, data } envelope.
 *
 * Usage:
 *   res.status(200).json(new ApiResponse(200, data, "Services fetched successfully"));
 */

class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {*}      data       - Response payload (object, array, etc.)
   * @param {string} message    - Human-readable success message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = { ApiResponse };
