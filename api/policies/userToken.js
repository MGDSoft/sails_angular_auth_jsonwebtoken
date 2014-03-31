var jwt = require('jws');

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

    var  decode ,userId
        ,ERROR_MSG="Invalid token"
        ,authorization = req.headers['authorization'];

    if (!authorization)
        return res.forbidden(ERROR_MSG);

    try {

        decode = jwt.decode(authorization);
        userId = JSON.parse(decode.payload).id;

        sails.log.debug("Token: user id " + userId);

    } catch (err) {

        sails.log.info( "Token validation, error "+ err );
        return res.forbidden(ERROR_MSG);
    }

    User.findOne(userId).done(function (err, user){

        if (!user || err)
            return res.forbidden(ERROR_MSG);

        if (!jwt.verify(authorization, user.salt + user.tokenDate ))
            return res.forbidden(ERROR_MSG);

        return next();
    });

};
