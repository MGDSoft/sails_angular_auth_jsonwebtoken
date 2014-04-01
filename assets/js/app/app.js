'use strict';

angular.module('angular-client-side-auth', ['ngCookies', 'ui.router', 'ngSails', 'reCAPTCHA'])

    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', '$sailsProvider','reCAPTCHAProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sailsProvider, reCAPTCHAProvider) {

        // required: please use your own key :)
        reCAPTCHAProvider.setPublicKey('6LeU__ASAAAAAB5B85GCXz4KzGBkZXto-KxyBXHv');

        // optional: gets passed into the Recaptcha.create call
//        reCAPTCHAProvider.setOptions({
//            theme: 'clean'
//        });

        var access = routingConfig.accessLevels;

        // Public routes
        $stateProvider
            .state('public', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.public
                }
            })
            .state('public.404', {
                url: '/404/',
                templateUrl: '/templates/404.html'
            });

        // Anonymous routes
        $stateProvider
            .state('anon', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.anon
                }
            })
            .state('anon.login', {
                url: '/login/',
                templateUrl: '/templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('anon.register', {
                url: '/register/',
                templateUrl: '/templates/register.html',
                controller: 'RegisterCtrl'
            });

        // Regular user routes
        $stateProvider
            .state('user', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.user
                }
            })
            .state('user.home', {
                url: '/',
                templateUrl: '/templates/home.html'
            })
            .state('user.private', {
                abstract: true,
                url: '/private/',
                templateUrl: '/templates/private/layout.html'
            })
            .state('user.private.home', {
                url: '',
                templateUrl: '/templates/private/home.html'
            })
            .state('user.private.nested', {
                url: 'nested/',
                templateUrl: '/templates/private/nested.html'
            })
            .state('user.private.admin', {
                url: 'admin/',
                templateUrl: '/templates/private/nested_admin.html',
                data: {
                    access: access.admin
                }
            });

        // Admin routes
        $stateProvider
            .state('admin', {
                abstract: true,
                template: "<ui-view/>",
                data: {
                    access: access.admin
                }
            })
            .state('admin.admin', {
                url: '/admin/',
                templateUrl: '/templates/admin.html',
                controller: 'AdminCtrl'
            });


        $urlRouterProvider.otherwise('/404');

        // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
        $urlRouterProvider.rule(function($injector, $location) {
            if($location.protocol() === 'file')
                return;

            var path = $location.path()
            // Note: misnomer. This returns a query object, not a search string
                , search = $location.search()
                , params
            ;

            // check to see if the path already ends in '/'
            if (path[path.length - 1] === '/') {
                return;
            }

            // If there was no search string / query params, return with a `/`
            if (Object.keys(search).length === 0) {
                return path + '/';
            }

            // Otherwise build the search string and return a `/?` prefix
            params = [];
            angular.forEach(search, function(v, k){
                params.push(k + '=' + v);
            });
            return path + '/?' + params.join('&');
        });

        $locationProvider.html5Mode(true);

        // sockets requests Pending update ngSails
//        $sailsProvider.interceptors.push(['$q', function ($q) {
//            return{
//                request: function (config) {
//                    console.log("troll");
//                    // ... stuff
//                    return config || $q.when(config);
//                },
//                response: function (response) {
//                    // ... stuff
//                    return response || $q.when(response);
//                },
//                requestError: function (config) {
//                    // ... stuff
//                    return $q.reject(reason);
//                },
//                responseError: function (response) {
//                    // ... stuff
//                    return $q.reject(reason);
//                }
//            }
//        }]);

        // http requests
        $httpProvider.interceptors.push(['$q', '$location', 'AlertService', '$log', '$injector', function($q, $location, AlertService, $log, $injector) {

            return {
                request: function (config) {

                    config.headers = config.headers || {};

                    if (localStorage.token)
                        config.headers.Authorization = localStorage.token;

                    return config;
                },
                responseError: function(response) {

                    if(response.status === 401 || response.status === 403) {

                        var Auth = $injector.get('Auth');
                        $log.warn('Need permision from url '+ response.config.url);
                        AlertService.addWarning("Need permissions");

                        Auth.deleteCurrentUser();
                        Auth.updateCurrentUser();
                        $location.path('/login');

                    }else if (response.status === 500) {

                        AlertService.addWarning("Server Error");

                    }else {

                        if (typeof response == 'object'){
                            if (typeof response.data.validationErrors != 'undefined'){
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

                if(fromState.url === '^') {
                    if(Auth.isLoggedIn()) {
                        $state.go('user.home');
                    } else {
                        $state.go('anon.login');
                    }
                }

                AlertService.removeAll();
            }
        });

    }]);