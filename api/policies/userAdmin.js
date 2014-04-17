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

    JWTService.getUserFromHeaders(req).then( function (user){

        if (!user || user.locked)
            return res.forbidden('You are not permitted to perform this action. 1');

        if (user.role.bitMask != userRoles.admin.bitMask)
            return res.forbidden('You are not permitted to perform this action. 2');

        return next();

    }).fail(function(err){
        return res.serverError(err);
    });

};
