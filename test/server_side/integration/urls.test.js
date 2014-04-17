var supertest = require("supertest")
    extend = require('util')._extend
    , Q = require("q")
;

// user account
var user = {
    'username':'newUserRole',
    'role':{bitMask: 2,title: "user"},
    'recaptcha_response_field': 'true',
    'password':'12345'
};

var userWithoutCatcha = extend({}, user);
userWithoutCatcha.recaptcha_response_field = 'false';

// admin account
var admin = {
    'username':'admin',
    'role': { bitMask: 4, title: 'admin' },
    'recaptcha_response_field': 'true',
    'password':'123'
};

function generateTokenByUsername(username){

    var deferred = Q.defer();

    User.findOneByUsername(username).then(function (user){
        user.token = JWTService.generateToken(user);

        deferred.resolve(user);

    }).fail(function(err){
        deferred.reject(new Error(err));
    });

    return deferred.promise;
}

describe('HTTP Sails Test:', function () {
    describe('HTTP SuperTests:', function () {

        before(function(){
            User.destroy(function () {} )
        });

        it ('should request "/" on server', function (done) {
            supertest(sails.hooks.http.app).get('/').expect(200, done);
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

        it('Logout Nobody logged - Return a 500', function(done) {
            supertest(sails.hooks.http.app).post('/v1/auth/logout').expect(500, done);
        });

        it('Logout - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(admin).expect(201, function(){
                generateTokenByUsername(admin.username).then( function(user){
                    supertest(sails.hooks.http.app).post('/v1/auth/logout').set('Authorization', user.token).expect(200, done);
                });
            });
        });

        it('As a normal user, on /users - Return a 403', function(done) {
            supertest(sails.hooks.http.app).get('/v1/user').expect(403, done);
        });

        it('As a Admin user, on /users - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(admin).expect(201, function(){

                generateTokenByUsername(admin.username).then( function(user){
                    supertest(sails.hooks.http.app).get('/v1/user').set('Authorization', user.token).expect(200, done);
                });
            });
        });

        it('Delete non-existent user on /user/delete/1 - Return a 403', function(done) {
            supertest(sails.hooks.http.app).del('/v1/user/1').expect(403, done);
        });

        it('Trying to delete other user - Return a 403', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(201, function(){

                generateTokenByUsername(admin.username).then(function(user){
                    supertest(sails.hooks.http.app).del('/v1/user/'+(user.id + '1123123')).set('Authorization', user.token).expect(403, done);
                });
            });
        });

        it('Delete a user on /user/delete/1  - Return a 200', function(done) {
            supertest(sails.hooks.http.app).post('/v1/user/create').send(user).expect(201, function(){

                generateTokenByUsername(admin.username).then( function(user){
                    supertest(sails.hooks.http.app).del('/v1/user/'+user.id).set('Authorization', user.token).expect(200, done);
                });
            });
        });

    });
});






