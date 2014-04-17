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
        ,ERROR_MSG="Invalid token, ref: "+ req.url
        ,authorization = req.headers['authorization'] || req.param('token');

    console.log("TOKEN "+ authorization);
    console.log(req.headers['authorization']);
    console.log(req.param('token'));
    console.log("------------");

    if (!authorization)
        return res.forbidden(ERROR_MSG +'1');

    decoded = JWTService.decodeToken(authorization);

    if (!decoded || typeof decoded.payload.id == 'undefined')
        return res.forbidden(ERROR_MSG +'2');

    User.findOne(decoded.payload.id).then(function (user){

        if (!user )
            return res.forbidden(ERROR_MSG+'3');

        if (!JWTService.isValidToken(authorization, user ))
            return res.forbidden(ERROR_MSG+'4');

        return next();

    }).fail(function(err){
        return res.serverError(err);
    });

};
