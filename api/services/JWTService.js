var jwt = require('jws')
    , Q = require("q")
;

module.exports = {


    isValidToken: function(token, user)
    {
        if (!user)
            return false;

        return jwt.verify(token, user.salt + user.tokenDate);
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

    /**
     *
     * @param {'ma}
     * @returns {*}
     */
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

    /**
     * @param {req} req
     * @returns {Promise}
     */
    getUserFromHeaders: function (req)
    {
        var authorization = req.param('token') || req.headers['authorization'],
            userId,
            deferred = Q.defer();
        ;

        if (!authorization)
        {
            deferred.reject(new Error('authorization doesn`t exist'));
        }else{

            try {

                userId = JSON.parse(jwt.decode(authorization).payload).id;

            } catch (err) {
                deferred.reject(new Error('Invalid User'));
                return deferred.promise;
            }

            User.findOne(userId).then(function (user){

                if (!user)
                    deferred.reject(new Error('User doesnt exist'));

                deferred.resolve(user);
            });
        }



        return deferred.promise;
    }
};