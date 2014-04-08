'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
    .controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', '$log', '$sails', 'AlertService', '$translate',
        function($rootScope, $scope, $location, Auth, $log, $sails, AlertService, $translate) {

        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };

        $scope.logout = function() {
            Auth.logout(function() {
                $location.path('/login');
            }, function() {
                //$rootScope.error = "Failed to logout";
            });
        };



        $scope.delete = function() {

            if (typeof Auth.user.id == 'undefined' )
            {
                $location.path('/login');
                return;
            }

            Auth.delete(Auth.user.id , function() {
                $location.path('/login');
            }, function() {

            });
        };


        (function () {


            $sails.get("/v1/user/subscribe")

                .success(function (data) {

                    $log.info("Attach a listener which fires every time User publishes");

                    $sails.on('user', function newMessageFromSails(res) {

                        if (res.verb == 'created')
                        {
                            AlertService.addSuccess("New User has been created "+ res.data.username);

                        }else if (res.verb == 'updated'){

                            if (res.data.logged)
                            {
                                AlertService.addSuccess(res.data.username + " is online !");

                            }else{

                                AlertService.addSuccess(res.data.username + " left site !");
                            }

                        }else if (res.verb == 'destroyed'){
                            AlertService.addWarning(res.previous.username + " destroyed his account. :( ");
                        }

                        $log.info("Change in entity user ", res);

                    });

                })

                .error(function (data) {
                    $log.error(data);
                });



            $sails.get("/firehose")

                .success(function (data) {
                    $sails.on("firehose", function (message) {
                        $log.debug("firehose, ",message);
                    });
                })

                .error(function (data) {
                    $log.error(data);
                });

        }());

    }]);

angular.module('angular-client-side-auth')
    .controller('LoginCtrl',
        ['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

            $scope.rememberme = true;
            $scope.login = function() {
                Auth.login({
                        username: $scope.username,
                        password: $scope.password,
                        rememberme: $scope.rememberme
                    },
                    function(res) {
                        $location.path('/');
                    },
                    function(err) {
                        //$rootScope.error = "Failed to login";
                    });
            };

            $scope.loginOauth = function(provider) {
                $window.location.href = '/auth/' + provider;
            };
        }]);

angular.module('angular-client-side-auth')
    .controller('RegisterCtrl',
        ['$rootScope', '$scope', '$location', 'Auth', 'AlertService', '$window', function($rootScope, $scope, $location, Auth, AlertService, $window) {
            $scope.role = Auth.userRoles.user;
            $scope.userRoles = Auth.userRoles;

            $scope.register = function() {
                Auth.register({
                        username: $scope.username,
                        password: $scope.password,
                        role: $scope.role,
                        recaptcha_challenge_field: document.getElementById('recaptcha_challenge_field').value,
                        recaptcha_response_field: document.getElementById('recaptcha_response_field').value
                    },
                    function() {
                        $location.path('/login');
                        AlertService.addSuccess("Your account was saved!");
                    },
                    function(err) {
                        $window.Recaptcha.reload();
                        //$rootScope.error = err;
                    });
            };
        }]);

angular.module('angular-client-side-auth')
    .controller('AdminCtrl',
        ['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
            $scope.loading = true;
            $scope.userRoles = Auth.userRoles;

            Users.getAll(function(res) {
                $scope.users = res;
                $scope.loading = false;
            }, function(err) {
                //$rootScope.error = "Failed to fetch users.";
                $scope.loading = false;
            });

        }]);