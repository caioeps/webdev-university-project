/**
 * @param {Object} error - The error from Joi lib.
 * @returns {Object} A better formatted error so it can be used by the frontend.
 */
module.exports = function decorateJoiError(error) {
  if (!error) return error;

  return error.details.reduce((errors, { context: { key }, message }) => {
    errors[key] = message;
    return errors;
  }, {});
}
