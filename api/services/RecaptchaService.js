var Recaptcha = require('recaptcha').Recaptcha
    , Q = require("q")
    ;

module.exports = {

    isValid: function(req)
    {
        var deferred = Q.defer();

        if (sails.config.environment === 'testing')
        {
            if (req.param('recaptcha_response_field') == 'true')
                deferred.resolve(true);
            else
                deferred.resolve(false);

            return deferred.promise;
        }

        var data = {
            remoteip:  req.connection.remoteAddress,
            challenge: req.body.recaptcha_challenge_field,
            response:  req.body.recaptcha_response_field
        };

        var recaptcha = new Recaptcha(sails.config.RECAPTCHA_PUBLIC_KEY, sails.config.RECAPTCHA_PRIVATE_KEY, data);

        recaptcha.verify(function(success, error_code) {

            if (success)
                deferred.resolve(true);
            else
                deferred.resolve(false);
        });

        return deferred.promise;
    }

};