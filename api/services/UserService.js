var jwt = require('jws')
;

module.exports = {

    getUserFromHeaders: function (req, done)
    {
        var authorization = req.headers['authorization'],
            userId;

        if (!authorization)
            return done('header doesn`t exist',null);

        try {

            userId = JSON.parse(jwt.decode(authorization).payload).id;

        } catch (err) {
            return done('Invalid User',null);
        }

        User.findOne(userId).done(function (err, user){

            if (!user || err)
                return done('User doesnt exist', null);

            return done(null, user);
        });

    }
};