var passport = require('passport');

/**
 * UserController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    create: function (req, res) {

        var username = req.param('username'),
            password = req.param('password'),
            role = req.param('role')
        ;

        if (! username || !password || !role)
            return res.invalidDataRequest('Data are required');

        User.findOneByUsername(username).done(function (err, user) {

            if (err)
                return res.serverError(err);

            if (user)
                return res.invalidDataRequest('The username is not unique');

            RecaptchaService.isValid(req, function (err, isValid) {

                if ( !isValid || err )
                    return res.invalidDataRequest('captcha is not valid');

                User.create({

                    username: username,
                    password: password,
                    role    : role

                }).done(function (err, user) {

                    if (err || !user)
                        return res.serverError(err);

                    res.send(201);

                });
            });
         });

    },

    subscribe: function (req, res) {

        // Find all current users in the user model
        User.find().done(function findUsers(err, users) {

            if (err)
                return req.serverError(err);

            // subscribe this socket to the User model classroom
            User.subscribe(req.socket);

            // subscribe this socket to the user instance rooms
            User.subscribe(req.socket, users);

            // This will avoid a warning from the socket for trying to render
            // html over the socket.
            res.send(200);

        });

    },

    prueba: function (req, res) {

        console.log(req.param);
        res.send(200);
    }
};
