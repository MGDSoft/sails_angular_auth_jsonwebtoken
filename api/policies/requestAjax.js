/**
 * ajaxRequest
 *
 * @module      :: Policy
 * @description :: Validate Ajax request
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

    if (this.req.headers['x-requested-with']) {
        // Allow sails to process routing
        return next();
    } else {
        return res.forbidden('only ajax requests.');
    }
};
