var jwt = require('jws');

module.exports = {

    isValidToken: function(token, user, done)
    {
        if (!user)
            return false;

        if (!jwt.verify(token, user.salt + user.tokenDate ))
            return false;

        return true;
    },

    decodeToken: function(token)
    {
        try {

            var decode = jwt.decode(token);
            decode.payload = JSON.parse(decode.payload);

            return decode;

        } catch (err) {

            return null;
        }
    },

    generateToken: function(user)
    {
        if (!user)
            return null;

        var token = jwt.sign({
            header: { alg: 'hs256' },
            payload: { id: user.id },
            secret: user.salt + user.tokenDate
        });

        sails.log("Token generated " + token);

        return token;
    },

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