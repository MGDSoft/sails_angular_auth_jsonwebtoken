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

        JWTService.getUserFromHeaders(req).then(function (user) {

            if (!user)
                return res.invalidDataRequest('User doesnt exist');

            User.publishUpdate(user.id, {
                id: user.id,
                logged: false,
                username: user.username
            });

            return res.send(200);

        }).fail(function(err){
            return res.serverError(err);
        });

    },

    login: function(req, res, next)
    {
        var username = req.param('username')
            ,password = req.param('password')
            ,remember = req.param('rememberme')
        ;

        if (!username || !password)
            return res.invalidDataRequest('Username or password is required');

        User.findOneByUsername(username).then(function (user) {

            if (!user)
                return res.invalidDataRequest('Incorrect username.');

            if (user.locked)
                return res.invalidDataRequest('User was locked.');

            if (!user.validPassword(password)){

                user.sumFailsLoginNumber();
                user.save();

                return res.invalidDataRequest('Invalid password');
            }

            return res.json(200, responseOkLogin(user, remember, true));

        }).fail(function(err){
            return res.serverError(err);
        });
    },

    remember: function (req, res, next)
    {
        var id = req.param('id')
            ,key = req.param('key')
        ;

        if (!id || !key )
            res.badRequest('Fields are required');

        User.findOne(id).then(function (user){

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

        }).fail(function(err){
            return res.serverError(err);
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

    User.publishUpdate(user.id, {
        id: user.id,
        logged: true,
        username: user.username
    });

    return  { data: {id: user.id, role: user.role, username: user.username }, token: token, remember: user.rememberCode } ;
}