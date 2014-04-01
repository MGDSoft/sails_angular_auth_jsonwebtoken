/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   '/trial/signup'
 * );
 * 
 * @param {Array|Object|String} validationErrors
 *      optional errors
 *      usually an array of validation errors from the ORM
 *
 * @param {String} redirectTo
 *      optional URL
 *      (absolute or relative, e.g. google.com/foo or /bar/baz)
 *      of the page to redirect to.  Usually only relevant for traditional HTTP requests,
 *      since if this was triggered from an AJAX or socket request, JSON should be sent instead.
 */

module.exports = function badRequest(validationErrors) {
  
  // Get access to `req`, `res`, `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  var statusCode = 422;

  var result = {
    status: statusCode
  };

  // Optional validationErrors object
  if (validationErrors) {
    result.validationErrors = validationErrors;
  }

  // For requesters expecting JSON, everything works like you would expect-- a simple JSON response
  // indicating the 400: Bad Request status with relevant information will be returned. 
  if (req.wantsJSON) {
    return res.json(result, result.status);
  }

  return res.json(result, result.status);
};
