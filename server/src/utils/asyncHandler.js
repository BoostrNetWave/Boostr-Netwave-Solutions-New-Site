/**
 * asyncHandler — Higher-order function that wraps async route handlers.
 *
 * Eliminates the try/catch boilerplate from every controller function.
 * Any thrown error (including ApiError instances) is passed to Express's
 * next() and caught by the centralized errorHandler middleware.
 *
 * Usage:
 *   router.get("/", asyncHandler(async (req, res) => {
 *     const data = await SomeModel.find();
 *     res.json(new ApiResponse(200, data, "Fetched successfully"));
 *   }));
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Support both: const asyncHandler = require(...) AND const { asyncHandler } = require(...)
module.exports = asyncHandler;
module.exports.asyncHandler = asyncHandler;
