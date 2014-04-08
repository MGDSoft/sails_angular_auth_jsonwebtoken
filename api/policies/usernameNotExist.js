
module.exports = function (req, res, next) {

    var username = req.param('username');

    if (!username)
        return res.invalidDataRequest('The username is required');

    User.findOneByUsername(username).done(function (err, user) {

        if (err)
            return res.serverError(err);

        if (user)
            return res.invalidDataRequest('The username is not unique');

        return next();
    });

};