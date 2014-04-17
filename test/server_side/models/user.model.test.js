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

        it ('should create a User record', function (then) {
            User.create(user).then(function (err, user) {
                assert.isNotNull(user);
            }).fail(function(err){
                throw new Error(err);
            }).done(
                function(){ then() ;}
            );
        });

        it ('should have exactly one record', function (then) {
            User.count(function (err, cnt) {
                assert.isNull(err);
                assert.equal(cnt, 1);
                then();
            });
        });

        it ('should be named '+ user.username, function (then) {
            User.find().limit(1).then(function (use) {
                assert.equal(use[0].username, user.username);
            }).fail(function(err){
                throw new Error(err);
            }).done(
                function(){ then() ;}
            );
        });

        it ('duplicate username throw exception', function (then) {
            User.create(user).then(function (user) {
            }).fail(function(err){
                assert.isNotNull(err);
            }).done(
                function(){ then() ;}
            );
        });

        it ('compare encrypted password OK', function (then) {
            User.findOne({username: user.username}).then(function (use) {
                assert.isTrue(use.validPassword('12345'));
                assert.isFalse(use.validPassword('lieeeeee'));
            }).fail(function(err){
                throw new Error(err);
            }).done(
                function(){ then() ;}
            );
        });

    });
});