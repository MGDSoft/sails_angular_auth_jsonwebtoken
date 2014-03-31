var passport =  require('passport');

/**
 * UserController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    subscribe:  function (req,res) {

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

    }
};
