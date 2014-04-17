'use strict';

(function(exports){

    var PATHS = {
        API : '/v1',
        UPLOADS: '/uploads'
    };

    var API_PATHS = {
        AUTH_REMEMBER : PATHS.API + '/auth/remember',
        AUTH_LOGIN : PATHS.API + '/auth/login',
        AUTH_LOGOUT : PATHS.API + '/auth/logout',

        USER_VALIDATION_USERNAME : PATHS.API + '/user/validation/username/{0}',
        USER_REST : PATHS.API + '/user/{0}',
        USER_SUBSCRIBE : PATHS.API + '/user/subscribe',

        USER_PROFILE_REST : PATHS.API + '/user-profile/{0}',
        USER_PROFILE_UPLOAD_PHOTO : PATHS.API + '/user-profile/photo/{0}',

        UPLOADS: '/uploads'
    };

    exports.CONSTANTS = {

        PATHS: PATHS,
        API_PATHS: API_PATHS,

        NOBODY_PHOTO: '/images/nobody-photo.jpg',
        CAPTCHA_KEY: '6LeU__ASAAAAAB5B85GCXz4KzGBkZXto-KxyBXHv'
    };

})(typeof exports === 'undefined' ? this['config'] = {} : exports.config);