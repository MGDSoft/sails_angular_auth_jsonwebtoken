'use strict';

angular.module('angular-client-side-auth', ['ngCookies', 'ui.router', 'ngAnimate', 'ngSails', 'reCAPTCHA', 'pascalprecht.translate', 'ngUpload'])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$sailsProvider', 'reCAPTCHAProvider', '$translateProvider'
        , function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sailsProvider, reCAPTCHAProvider, $translateProvider) {

            // required: please use your own key :)
            reCAPTCHAProvider.setPublicKey(config.CONSTANTS.CAPTCHA_KEY);

            // optional: gets passed into the Recaptcha.create call
//        reCAPTCHAProvider.setOptions({
//            theme: 'clean'
//        });

            $translateProvider
                .translations('en', translationsEN)
                .translations('es', translationsES)
                .preferredLanguage('en');

            var access = routingConfig.accessLevels;

            // Public routes
            $stateProvider
                .state('public', {
                    abstract: true,
                    template: "<ui-view/>",
                    data    : {
                        access: access.public
                    }
                })
                .state('public.404', {
                    url        : '/404',
                    templateUrl: '/templates/404.html'
                });

            // Anonymous routes
            $stateProvider
                .state('anon', {
                    abstract: true,
                    template: "<ui-view/>",
                    data    : {
                        access: access.anon
                    }
                })
                .state('anon.login', {
                    url        : '/login',
                    templateUrl: '/templates/login.html',
                    controller : 'LoginCtrl'
                })
                .state('anon.register', {
                    url        : '/register',
                    templateUrl: '/templates/register.html',
                    controller : 'RegisterCtrl'
                });

            // Regular user routes
            $stateProvider
                .state('user', {
                    abstract: true,
                    template: "<ui-view/>",
                    data    : {
                        access: access.user
                    }
                })
                .state('user.home', {
                    url        : '/',
                    templateUrl: '/templates/home.html'
                })
                .state('user.profile', {
                    url        : '/profile/:profileId',
                    templateUrl: '/templates/profile.html',
                    controller : 'ProfileCtrl'
                })
                .state('user.private', {
                    abstract   : true,
                    url        : '/private',
                    templateUrl: '/templates/private/layout.html'
                })
                .state('user.private.home', {
                    url        : '',
                    templateUrl: '/templates/private/home.html'
                })
                .state('user.private.nested', {
                    url        : '/nested',
                    templateUrl: '/templates/private/nested.html'
                })
                .state('user.private.admin', {
                    url        : '/admin',
                    templateUrl: '/templates/private/nested_admin.html',
                    data       : {
                        access: access.admin
                    }
                });

            // Admin routes
            $stateProvider
                .state('admin', {
                    abstract: true,
                    template: "<ui-view/>",
                    data    : {
                        access: access.admin
                    }
                })
                .state('admin.admin', {
                    url        : '/admin',
                    templateUrl: '/templates/admin.html',
                    controller : 'AdminCtrl'
                });

            $urlRouterProvider.otherwise('/404');

            $locationProvider.html5Mode(true);

            // http requests
            $httpProvider.interceptors.push(['$q', '$location', 'AlertService', '$log', '$injector', function ($q, $location, AlertService, $log, $injector) {

                return {
                    request      : function (config) {

                        config.headers = config.headers || {};

                        if (localStorage.token)
                            config.headers.Authorization = localStorage.token;

                        return config;
                    },
                    responseError: function (response) {

                        if (response.status === 401 || response.status === 403) {

                            var Auth = $injector.get('Auth');
                            $log.warn('Need permision from url ' + response.config.url);
                            AlertService.addWarning("Need permissions");

                            Auth.deleteCurrentUser();
                            Auth.updateCurrentUser();
                            $location.path('/login');

                        } else if (response.status === 500) {

                            AlertService.addWarning("Server Error");

                        } else {

                            if (typeof response == 'object') {
                                if (typeof response.data.validationErrors != 'undefined') {
                                    AlertService.addError(response.data.validationErrors);
                                }
                            }

                        }
                        return $q.reject(response);
                    }
                };
            }]);

        }])

    .run(['$rootScope', '$state', 'Auth', 'AlertService', '$log', function ($rootScope, $state, Auth, AlertService, $log) {

        $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {

            if (!Auth.authorize(toState.data.access)) {

                AlertService.addWarning("Seems like you tried accessing a route you don't have access to...");
                event.preventDefault();

                if (fromState.url === '^') {
                    if (Auth.isLoggedIn()) {
                        $state.go('user.home');
                    } else {
                        $state.go('anon.login');
                    }
                }

                AlertService.removeAll();
            }
        });

    }]);