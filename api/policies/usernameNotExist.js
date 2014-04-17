
module.exports = function (req, res, next) {

    var username = req.param('username');

    if (!username)
        return res.invalidDataRequest('The username is required');

    User.findOneByUsername(username).then(function (user) {

        if (user)
            return res.invalidDataRequest('The username is not unique');

        return next();

    }).fail(function(err){
        return res.serverError(err);
    });

};