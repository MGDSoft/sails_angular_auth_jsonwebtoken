var passport =  require('passport');

/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    logout: function(req, res)
    {
        req.logout();
        res.send(200);

        JWTService.getUserFromHeaders(req, function (err, user) {

            if (err || !user)
                return;

            User.publishUpdate(user.id, {
                id: user.id,
                logged: false,
                username: user.username
            });
        });

    },

    login: function(req, res, next)
    {
        var username = req.param('username')
            ,password = req.param('password')
            ,remember = req.param('rememberme')
        ;

        if (!username || !password)
            res.badRequest('Username or password is required');

        User.findOneByUsername(username).done(function (err, user) {

            if (err)
                return res.serverError('login crash');

            if (!user || user.provider)
                return res.invalidDataRequest('Incorrect username.');

            if (user.locked)
                return res.invalidDataRequest('User was locked.');

            if (!user.validPassword(password)){

                user.sumFailsLoginNumber();
                user.save();
                return res.invalidDataRequest('Invalid password');
            }

            res.json(200, responseOkLogin(user, remember, true));

        });
    },

    remember: function (req, res, next)
    {
        var id = req.param('id')
            ,key = req.param('key')
        ;

        if (!id || !key )
            res.badRequest('Fields are required');

        User.findOne(id).done(function (err, user){

            if (err)
                return res.serverError('Login crash');

            if (!user)
                return res.badRequest('Incorrect username.');

            if (user.locked)
                return res.badRequest('User was locked.');

            if (!user.isCookieValid(key))
            {
                user.sumFailsLoginNumber();
                user.save();

                return res.badRequest('Wrong cookie key, only valid cookie in a place.');
            }

            res.json(200, responseOkLogin(user, false, false));
        });

    }

};

function responseOkLogin(user, needCreateRemember, needResetRemember)
{
    if (needResetRemember)
        user.rememberCode = '{}';

    if (needCreateRemember)
        user.generateRememberCode();

    sails.log.info("Logged as " + user.username );

    var token = user.generateToken();
    // Reset failsLoginNumber
    user.failsLoginNumber = 0;
    user.save();

    sails.log.debug("Token generated " + token);

    User.publishUpdate(user.id, {
        id: user.id,
        logged: true,
        username: user.username
    });

    return  { data: {id: user.id, role: user.role, username: user.username }, token: token, remember: user.rememberCode } ;
}