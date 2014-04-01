var Recaptcha = require('recaptcha').Recaptcha;

module.exports = {

    isValid: function(req, done)
    {
        if (sails.config.environment === 'testing')
        {
            if (req.param('captcha'))
                return done(null, true);
            else
                return done(null, false);
        }

        var data = {
            remoteip:  req.connection.remoteAddress,
            challenge: req.body.recaptcha_challenge_field,
            response:  req.body.recaptcha_response_field
        };

        var recaptcha = new Recaptcha(sails.config.RECAPTCHA_PUBLIC_KEY, sails.config.RECAPTCHA_PRIVATE_KEY, data);

        recaptcha.verify(function(success, error_code) {

            if (!success)
                done(error_code, false);

            done(null, true);

        });
    }

};