
module.exports = function (req, res, next) {

    RecaptchaService.isValid(req).then(function ( isValid) {

        if ( !isValid )
            return res.invalidDataRequest('captcha is not valid');

        return next();

    }).fail(function(err){
        return res.serverError(err);
    });

};
