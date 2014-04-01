var supertest = require("supertest")
    extend = require('util')._extend;
;

// user account
var user = {
    'username':'newUserRole',
    'role':{bitMask: 2,title: "user"},
    'captcha': true,
    'password':'12345'
};

var userWithoutCatcha = extend({}, user);
userWithoutCatcha.captcha = false;

// admin account
var admin = {
    'username':'admin',
    'role': { bitMask: 4, title: 'admin' },
    'captcha':true,
    'password':'123'
};

function generateTokenByUsername(username, cb){
    User.findOneByUsername(username).done(function (err, user){
        var token = JWTService.generateToken(user);
        cb(err, token, user);
    });
}

describe('HTTP Sails Test:', function () {
    describe('HTTP SuperTests:', function () {

        before(function(){
            User.destroy(function () {} )
        });

        it ('should request "/" on server', function (done) {
            supertest(sails.hooks.http.app).get('/').expect(200, done);
        });

        it('Logout - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/auth/logout').expect(200, done);
        });

        it('Register a new user no captcha - Return a 422', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(userWithoutCatcha).expect(422, done);
        });

        it('Register a new user - Return a 201', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(201, done);
        });

        it('Register a new admin - Return a 201', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(admin).expect(201, done);
        });

        it('Register a new user is not unique - Return a 422 ', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(201, function(){
                supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(422, done);
            });
        });

        it('As a normal user, on /users - Return a 403', function(done) {
            supertest(sails.hooks.http.app).get('/v1/user').expect(403, done);
        });

        it('As a Admin user, on /users - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(admin).expect(201, function(){

                generateTokenByUsername(admin.username, function(err, token){
                    supertest(sails.hooks.http.app).get('/v1/user').set('Authorization', token).expect(200, done);
                });
            });
        });

        it('Delete non-existent user on /user/delete/1 - Return a 403', function(done) {
            supertest(sails.hooks.http.app).del('/v1/user/1').expect(403, done);
        });

        it('Trying to delete other user - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(201, function(){

                generateTokenByUsername(admin.username, function(err, token, userr){
                    supertest(sails.hooks.http.app).del('/v1/user/'+(userr.id + 1)).set('Authorization', token).expect(403, done);
                });
            });
        });

        it('Delete a user user on /user/delete/1  - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(201, function(){

                generateTokenByUsername(admin.username, function(err, token, userr){
                    supertest(sails.hooks.http.app).del('/v1/user/'+userr.id).set('Authorization', token).expect(200, done);
                });
            });
        });

    });
});






