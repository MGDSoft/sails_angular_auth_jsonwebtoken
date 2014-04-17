var jwt = require('jws')
    , Q = require("q")
;

module.exports = {


    isValidToken: function(token, user)
    {
        sails.log.info(user);
        sails.log.info(token);

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

    /**
     *
     * @param {}
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
        var authorization = req.headers['authorization'] || req.param('token'),
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
                    deferred.reject(new Error('User Id:'+userId+' doesnt exist'));

                deferred.resolve(user);
            });
        }



        return deferred.promise;
    }
};