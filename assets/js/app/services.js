'use strict';

angular.module('angular-client-side-auth')
    .factory('Auth', function ($http, $cookieStore, $log, $location) {

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

            var user = getUserByCookieRemember();

            if (user)
                return user;

            // all vars are empty but just in case
            deleteCurrentUser(true);
        }

        function getUserByCookieRemember()
        {
            if ($cookieStore.get('user')) {
                var remember = JSON.parse($cookieStore.get('user'));

                if (remember.time < new Date().getTime()) {

                    $log.info("Cookie expired, deleting...");
                    $cookieStore.remove("user");
                    return null;

                }else{

                    $http.post('/v1/auth/remember', remember).success(function(res) {

                        $log.info("Load user by cookie");

                        handleLoginResponseOk(res);
                        // $state.reload() CRASH :S
                        $location.path('/');

                    }).error(function (err){
                        $log.info("Cookie is old, deleting....");
                        $cookieStore.remove("user");
                        return null;
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

            $log.debug("change user " + user.role.title);

            angular.extend(currentUser, user);
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
            register  : function (user, success, error) {

                $http.post('/v1/user/create', user)
                    .success(function (res) {
                        success();
                    })
                    .error(function(err){
                        error();
                });

            },
            login     : function (user, success, error) {

                $http.post('/v1/auth/login', user)
                    .success(function (res) {

                        success(handleLoginResponseOk(res));
                    })
                    .error(error)
                ;
            },

            delete : function (userId, success, error) {

                $http.delete('/v1/user/'+userId)
                    .success(function (res) {

                        deleteCurrentUser(true);
                        success();
                    })
                    .error(error)
                ;
            },

            logout      : function (success, error) {

                $http.post('/v1/auth/logout')
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
    .factory('Users', function ($http) {
        return {
            getAll: function (success, error) {
                $http.get('/v1/user/').success(success).error(error);
            }
        };
    });

angular.module('angular-client-side-auth')
    .factory('AlertService', function ($rootScope) {
        var alertService = {};

        // create an array of alerts available globally
        $rootScope.alerts = [];



        function add(type, msg) {
            alertService.removeAll();
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
