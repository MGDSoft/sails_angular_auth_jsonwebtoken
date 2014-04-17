var userRoles = require('../../assets/js/app/routingConfig').userRoles
    , Q = require("q")
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

    JWTService.getUserFromHeaders(req).then(function (user){

        if (!user || user.locked)
            return res.forbidden('You are not permitted to perform this action. 1');

        if (user.id != id)
            return res.forbidden('You are not permitted to perform this action. 2');

        next();

    }).fail(function(err){
        return res.serverError(err);
    });

};
