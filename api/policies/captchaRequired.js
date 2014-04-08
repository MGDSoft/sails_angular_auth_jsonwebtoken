
module.exports = function (req, res, next) {

    RecaptchaService.isValid(req, function (err, isValid) {
        if ( !isValid || err )
            return res.invalidDataRequest('captcha is not valid');

        return next();
    });

};
