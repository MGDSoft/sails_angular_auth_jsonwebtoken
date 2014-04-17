'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
    .controller('NavCtrl', function($rootScope, $scope, $location, Auth, User, $log, $sails, AlertService, $translate, $state) {

        $scope.user = Auth.user;
        $scope.userRoles = Auth.userRoles;
        $scope.accessLevels = Auth.accessLevels;

        $scope.changeLanguage = function (langKey) {
            $translate.use(langKey);
        };

        $scope.logout = function() {
            Auth.logout(function() {
                $state.go('anon.login');
            }, function() {
                //$rootScope.error = "Failed to logout";
            });
        };


        $scope.deleteAccount = function() {

            if (typeof Auth.user.id == 'undefined' )
            {
                $state.go('anon.login');
                return;
            }

            User.destroy(Auth.user.id , function() {
                Auth.deleteCurrentUser(true);
                $state.go('anon.login');
            }, function() {

            });
        };


        (function () {


            $sails.get(config.CONSTANTS.API_PATHS.USER_SUBSCRIBE)

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



//            $sails.get("/firehose")
//
//                .success(function (data) {
//                    $sails.on("firehose", function (message) {
//                        $log.debug("firehose, ",message);
//                    });
//                })
//
//                .error(function (data) {
//                    $log.error(data);
//                })
//            ;

        }());

    });

angular.module('angular-client-side-auth')
    .controller('LoginCtrl', function($rootScope, $scope, $location, $window, Auth, $state) {

        $scope.rememberme = true;
        $scope.login = function() {
            Auth.login({
                    username: $scope.username,
                    password: $scope.password,
                    rememberme: $scope.rememberme
                },
                function(res) {
                    $state.go('user.home');
                },
                function(err) {
                    //$rootScope.error = "Failed to login";
                });
        };

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };
    });

angular.module('angular-client-side-auth')
    .controller('RegisterCtrl', function($rootScope, $scope, $location, Auth, User, AlertService, $window, $state) {

        $scope.role = Auth.userRoles.user;
        $scope.userRoles = Auth.userRoles;

        $scope.register = function() {
            User.create({
                    username: $scope.username,
                    password: $scope.password,
                    role: $scope.role,
                    recaptcha_challenge_field: document.getElementById('recaptcha_challenge_field').value,
                    recaptcha_response_field: document.getElementById('recaptcha_response_field').value
                },
                function() {
                    $state.go('anon.login');
                    AlertService.addSuccess("Your account was saved!");
                },
                function(err) {
                    $window.Recaptcha.reload();
                });
        };
    });

angular.module('angular-client-side-auth')
    .controller('ProfileCtrl', function($rootScope, $scope, Auth, UserProfile, User, AlertService, $http, $log, $state, $stateParams) {


        $scope.profileId=$stateParams.profileId;

        $scope.photoSendUrl = config.CONSTANTS.API_PATHS.USER_PROFILE_UPLOAD_PHOTO.format($scope.profileId);

        $scope.token = localStorage.token || '';
        $scope.info = '';
        $scope.photoImage = config.CONSTANTS.NOBODY_PHOTO;

        $scope.complete = ( function(content) {
            if (typeof content.photo != 'undefined' && content.photo)
            {
                $scope.photoImage = config.CONSTANTS.PATHS.UPLOADS + content.photo;
                AlertService.addSuccess("UPDATED!");
            }
        });

        User.find($scope.profileId,
            function(res) {

                if (!res.username)
                    $state.go('public.404');

                $scope.username=res.username;
            }
        );


        UserProfile.find($scope.profileId,
            function(res) {
                $scope.info = res.info;

                if (res.photo)
                    $scope.photoImage = config.CONSTANTS.PATHS.UPLOADS + res.photo + '?i=' + new Date().getTime();

        });

        $scope.profile = function() {

            UserProfile.update($scope.profileId, { info: $scope.info },
                function(res) {
                    AlertService.addSuccess("UPDATED!");
                },
                function(err) {
                    $log.error(err);
                }
            );
        };

    });

angular.module('angular-client-side-auth')
    .controller('AdminCtrl',
        function($rootScope, $scope, User, Auth) {
            $scope.loading = true;
            $scope.userRoles = Auth.userRoles;

            User.findAll(function(res) {
                $scope.users = res;
                $scope.loading = false;
            }, function(err) {
                //$rootScope.error = "Failed to fetch users.";
                $scope.loading = false;
            });

        });