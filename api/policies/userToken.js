/**
 * userLogged
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */

module.exports = function (req, res, next) {

    var  decoded
        ,ERROR_MSG="Invalid token"
        ,authorization = req.headers['authorization'];

    if (!authorization)
        return res.forbidden(ERROR_MSG);

    decoded = JWTService.decodeToken(authorization);

    if (!decoded || typeof decoded.payload.id == 'undefined')
        return res.forbidden(ERROR_MSG);

    User.findOne(decoded.payload.id).done(function (err, user){

        if (!user || err)
            return res.forbidden(ERROR_MSG);

        if (!JWTService.isValidToken(authorization, user ))
            return res.forbidden(ERROR_MSG);

        return next();
    });

};
