var fs = require('fs');
/**
 * Routes
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {


    // Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, etc. depending on your
    // default view engine) your home page.
    //
    // (Alternatively, remove this and add an `index.html` file in your `assets` directory)
    '/': {
        view: 'index.html'
    },

    'post /v1/user/create': 'User.create',

    'get /v1/user': 'User.find',

    'post /v1/auth/login': 'Auth.login',

    'post /v1/auth/remember': 'Auth.remember',

    'post /v1/auth/logout': 'Auth.logout',

    // Sockets
    'get /v1/user/subscribe': 'User.subscribe',


    'get /*' : function(req, res, next) {

        // Sockets petitions
        if (!req.path)
            return next;

        // Api request
        if (req.path.match(/^\/(v1)\/.*/g)) {
            return next();
        }

        // Assets Js/CSS/images
        if (req.path.match(/\.(js|css|png|jpg|gif)$/g)) {
            return next();
        }

        var template = sails.config.paths.public + '/' + req.path;

        // Templates
        if (fs.existsSync(template)) {
            return res.sendfile(template);
        }

        // Load 404 in angular
        return res.sendfile(sails.config.paths.public + '/' + 'index.html');
    }


};
