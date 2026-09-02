const ApiError = require("../utils/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema(req);

      if (!result) {
        return next();
      }

      next();
    } catch (error) {
      next(
        new ApiError(
          400,
          error.message || "Validation failed"
        )
      );
    }
  };
};

module.exports = validate;