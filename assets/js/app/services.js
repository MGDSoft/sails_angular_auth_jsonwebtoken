'use strict';

angular.module('angular-client-side-auth')
    .factory('Auth', function ($http, $cookieStore, $log, $location, $rootScope) {

        var accessLevels = routingConfig.accessLevels
            , userRoles = routingConfig.userRoles
            , currentUser = { username: '', role: userRoles.public };

        setCurrentUser();

        function setCurrentUser()
        {
            if (typeof localStorage.user != 'undefined' && typeof localStorage.token != 'undefined'){

                $log.info("Load user by localStorage");
                return changeUser(JSON.parse(localStorage.user));
            }

            getUserByCookieRemember();

        }

        function getUserByCookieRemember()
        {
            if ($cookieStore.get('user')) {
                var remember = JSON.parse($cookieStore.get('user'));

                if (remember.time < new Date().getTime()) {

                    $log.info("Cookie expired, deleting...");
                    $cookieStore.remove("user");
                    deleteCurrentUser(true);

                }else{

                    $http.post(config.CONSTANTS.API_PATHS.AUTH_REMEMBER, remember).success(function(res) {

                        $log.info("Loading user by cookie");

                        handleLoginResponseOk(res);
                        // $state.reload() CRASH :S
                        $location.path('/');

                    }).error(function (err){
                        $log.info("Cookie is old, deleting....");
                        deleteCurrentUser(true);
                    });
                }
            }
        }

        function deleteCurrentUser(deleteCookie){

            localStorage.removeItem('user');
            localStorage.removeItem('token');

            if (deleteCookie)
                $cookieStore.remove("user");

            changeUser({ username: '', role: userRoles.public });
        }

        function handleLoginResponseOk (res){
            localStorage.token = res.token;

            var userObj = res.data;
            localStorage.user = JSON.stringify(userObj);

            if (typeof res.remember.key != 'undefined') {
                $cookieStore.put('user', JSON.stringify(res.remember));
            }

            changeUser(userObj);

            return userObj;
        }

        function changeUser(user) {

            if (!user)
                return deleteCurrentUser(false)

            $log.debug("change user " + user.role.title);

            angular.extend(currentUser, user);
            $rootScope.user = user;
        }

        return {

            updateCurrentUser: function(){
                setCurrentUser();
            },

            deleteCurrentUser: function(){
                deleteCurrentUser(false);
            },

            authorize : function (accessLevel, role) {

                if (role === undefined) {
                    role = currentUser.role;
                }

                return accessLevel.bitMask & role.bitMask;

            },
            isLoggedIn: function (user) {

                if (user === undefined) {
                    user = currentUser;
                }
                return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;

            },

            login     : function (user, success, error) {

                $http.post(config.CONSTANTS.API_PATHS.AUTH_LOGIN, user)
                    .success(function (res) {
                        success(handleLoginResponseOk(res));
                    })
                    .error(error)
                ;
            },

            logout      : function (success, error) {

                $http.post(config.CONSTANTS.API_PATHS.AUTH_LOGOUT)
                    .success(function () {

                        deleteCurrentUser(true);
                        success();
                    })
                    .error(error)
                ;
            },
            accessLevels: accessLevels,
            userRoles   : userRoles,
            user        : currentUser
        };
    });

angular.module('angular-client-side-auth')
    .factory('User', function ($http) {
        return {
            findAll: function (success, error) {
                $http.get(config.CONSTANTS.API_PATHS.USER_REST.format(''))
                    .success(success)
                    .error(error);
            },
            find: function (userId,success, error) {
                $http.get(config.CONSTANTS.API_PATHS.USER_REST.format(userId))
                    .success(success)
                    .error(error);
            },
            validateUsername: function (username, success, error) {

                $http.get(config.CONSTANTS.API_PATHS.USER_VALIDATION_USERNAME.format(username))
                    .success(function (res) {
                        success(res);
                    })
                    .error(function(err){
                        error();
                    });

            },
            create  : function (user, success, error) {

                $http.post(config.CONSTANTS.API_PATHS.USER_REST.format(''), user)
                    .success(function (res) {
                        success(res);
                    })
                    .error(error)
                ;

            },
            destroy : function (userId, success, error) {

                $http.delete(config.CONSTANTS.API_PATHS.USER_REST.format(userId))
                    .success(function (res) {

                        success();
                    })
                    .error(error)
                ;
            }
        };
    });

angular.module('angular-client-side-auth')
    .factory('UserProfile', function ($http) {
        return {
            find : function (userId, success, error) {

                $http.get(config.CONSTANTS.API_PATHS.USER_PROFILE_REST.format(userId))
                    .success(success)
                    .error(error)
                ;
            },

            update: function (userId, params, success, error) {

                error = error || function() {};

                $http.put(config.CONSTANTS.API_PATHS.USER_PROFILE_REST.format(userId), params)
                    .success(success)
                    .error(error)
                ;
            }
        };
    });


angular.module('angular-client-side-auth')
    .factory('AlertService', function ($rootScope, $timeout) {
        var alertService = {};

        // create an array of alerts available globally
        $rootScope.alerts = [];



        function add(type, msg) {

            if($rootScope.alerts.length > 0)
                $timeout( (function () { $rootScope.alerts.shift() }), 2000);

            $rootScope.alerts.push({'type': type, 'msg': msg});
        };

        alertService.addSuccess = function (msg) {
            add('success', msg);
        };

        alertService.addWarning = function (msg) {
            add('warning', msg);
        };

        alertService.addError = function (msg) {
            add('danger', msg);
        };

        alertService.addInfo = function (msg) {
            add('info', msg);
        };

        alertService.removeAll = function () {
            $rootScope.alerts = [];
        };

        return alertService;
    });
