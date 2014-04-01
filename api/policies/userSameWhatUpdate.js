var userRoles = require('../../assets/js/app/routingConfig').userRoles
    ;

/**
 * userAdmin
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated admin user
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function (req, res, next) {

    var id = req.param('id');

    JWTService.getUserFromHeaders(req, function (err, user){

        if (err || !user || user.locked)
            return res.forbidden('You are not permitted to perform this action. 1');

        if (user.id != id)
            return res.forbidden('You are not permitted to perform this action. 2');

        next();

    });

};
