var bcrypt = require('bcrypt')
    ,userRoles = require('../../assets/js/app/routingConfig').userRoles
    ,jwt = require('jws')
;

/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        username: {
            type     : 'string',
            required : true,
            unique   : true,
            maxLength: 100
        },

        password: {
            type    : 'string',
            required: true
        },

        role: {
            type      : 'json',
            maxLength : 50,
            defaultsTo: JSON.stringify(userRoles.user)
        },

        salt: {
            type: 'string'
        },

        // Only one token is valid per user and it will be refreshed in login
        tokenDate: {
            type: 'string'
        },

        failsLoginNumber: {
            type      : 'integer',
            defaultsTo: 0
        },

        locked: {
            type      : 'boolean',
            defaultsTo: false
        },

        rememberCode: {
            type: 'json'
        },


        validPassword: function (password) {

            return bcrypt.compareSync(password, this.password);
        },

        sumFailsLoginNumber: function () {

            this.failsLoginNumber++;
            if (this.failsLoginNumber >= sails.config.LOGIN_NUMBER_OF_RETRYS) {
                this.locked = true;
            }
        },

        resetFails: function () {

            this.failsLoginNumbe = 0;
            this.locked = false;
        },

        generateToken: function (){

            this.tokenDate = Date.now();

            var token = jwt.sign({
                header: { alg: 'hs256' },
                payload: { id: this.id },
                secret: this.salt + this.tokenDate
            });

            return token;
        },

        generateRememberCode: function () {

            var obj= {key: bcrypt.genSaltSync(), id: this.id, time: (Date.now() + (sails.config.AUTH_COOKIE_TIME_DAYS * 86400000))}

            this.rememberCode = obj;

            return obj;
        }

        ,isCookieValid: function (cookieKey){

            if (typeof this.rememberCode.time != 'number' || typeof this.rememberCode.key == 'undefined' || this.rememberCode.key == '' )
                return false;

            if (this.rememberCode.time < Date.now() )
                return false;

            if (this.rememberCode.key != cookieKey)
                return false;

            return true;
        },

        toJSON: function () {

            var obj = this.toObject();

            return {
                username: obj.username,
                role    : obj.role
            };
        }

    },

    // STATIC FUNCTIONS

    beforeCreate: function (values, next) {

        // Generate salt per user
        bcrypt.genSalt(function generateSalt(err, salt) {

            if (err)
                return next(err);

            values.salt = salt;

            if (values.provider)
                return next();

            // Password encripted by his salt
            bcrypt.hash(values.password, salt, function passwordEncrypted(err, encryptedPassword) {

                if (err)
                    return next(err);

                values.password = encryptedPassword;
                return next();
            });

        });

    }

};