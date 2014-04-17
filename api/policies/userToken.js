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


    sails.log.info("TOKEN "+ authorization);
    sails.log.info(req.headers['authorization']);
    sails.log.info(req.param('token'));
    sails.log.info("---- -------");

    if (!authorization)
        return res.forbidden(ERROR_MSG +'1');

    decoded = JWTService.decodeToken(authorization);

    if (!decoded || typeof decoded.payload.id == 'undefined')
        return res.forbidden(ERROR_MSG +'2');

    User.findOne(decoded.payload.id).then(function (user){

        if (!user )
            return res.forbidden(ERROR_MSG+'3');

        sails.log.info("RESULTADO 1", JWTService.isValidToken(authorization, user ));

        if (!JWTService.isValidToken(authorization, user ))
            return res.forbidden(ERROR_MSG+'4');

        return next();

    }).fail(function(err){
        return res.serverError(err);
    });

};
