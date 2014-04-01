var assert = require('chai').assert;

var user = {
    'username':'newUserRole',
    'role': {bitMask: 2,title: "user"},
    'password':'12345'
};


describe('Waterline User model test:', function () {

    before(function () {
        User.destroy(function () {} )
    });

    describe('User model test', function () {

        it ('should create a User record', function (done) {
            User.create(user).done(function (err, user) {
                assert.isNull(err);
                assert.isNotNull(user);
                done();
            });
        });

        it ('should have exactly one record', function (done) {
            User.count(function (err, cnt) {
                assert.isNull(err);
                assert.equal(cnt, 1);
                done();
            });
        });

        it ('should be named '+ user.username, function (done) {
            User.find().limit(1).done(function (err, use) {
                assert.isNull(err);
                assert.equal(use[0].username, user.username);
                done();
            });
        });

        it ('duplicate username throw exception', function (done) {
            User.create(user).done(function (err, user) {
                assert.isNotNull(err);
                assert.isUndefined(user);
                done();
            });
        });

        it ('compare encrypted password OK', function (done) {
            User.findOne({username: user.username}).done(function (err, use) {
                assert.isNull(err);
                assert.isTrue(use.validPassword('12345'));
                assert.isFalse(use.validPassword('lieeeeee'));
                done();
            });
        });

    });
});