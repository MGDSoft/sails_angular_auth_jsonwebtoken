'use strict';

angular.module('angular-client-side-auth')
    .directive('accessLevel', ['Auth', function(Auth) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                var prevDisp = element.css('display')
                    , userRole
                    , accessLevel;

                $scope.user = Auth.user;
                $scope.$watch('user', function(user) {
                    if(user.role)
                        userRole = user.role;
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function(al) {
                    if(al) accessLevel = $scope.$eval(al);
                    updateCSS();
                });

                function updateCSS() {
                    if(userRole && accessLevel) {
                        if(!Auth.authorize(accessLevel, userRole))
                            element.css('display', 'none');
                        else
                            element.css('display', prevDisp);
                    }
                }
            }
        };
    }]);

angular.module('angular-client-side-auth')
    .directive('ownerLevel', ['Auth', function(Auth) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {

                var ownerLevel;

                attrs.$observe('ownerLevel', function(al) {
                    if(al) ownerLevel = al;
                    updateCSS();
                });

                function updateCSS() {
                    var user = Auth.user;
                    if(ownerLevel && user && user.id == ownerLevel)
                        element.css('display', '');
                    else
                        element.css('display', 'none');
                }
            }
        };
    }]);

angular.module('angular-client-side-auth').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var anchor = element[0];
            if(element[0].tagName.toUpperCase() != 'A')
                anchor = element.find('a')[0];
            var path = anchor.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                path = normalizeUrl(path);
                newPath = normalizeUrl(newPath);

                if(path === newPath ||
                    (attrs.activeNav === 'nestedTop' && newPath.indexOf(path) === 0)) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

    function normalizeUrl(url) {
        if(url[url.length - 1] !== '/')
            url = url + '/';
        return url;
    }

}]);

angular.module('angular-client-side-auth').directive('validationUsername', function(User) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            elm.on('blur', function (evt) {
                scope.$apply(function () {
                    User.validateUsername(elm.val(), function(res){

                        ctrl.$setValidity('validationUsername', true);
                        return elm.val();

                    }, function(){
                        ctrl.$setValidity('validationUsername', false);
                        return undefined;
                    });
                });
            });
        }
    };
});