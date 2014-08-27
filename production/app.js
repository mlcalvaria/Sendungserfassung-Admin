//@prepros-append global/credentials.js
//@prepros-append global/global.module.js
//@prepros-append global/toolkit.service.js
//@prepros-append global/focus.directive.js
//@prepros-append global/tooltip.vendor.js
//@prepros-append global/info.service.js
//@prepros-append global/info.directive.js
//@prepros-append global/purr.js
//@prepros-append global/404.controller.js
//@prepros-append global/user.js

//@prepros-append start/start.module.js
//@prepros-append start/start.controller.js
//@prepros-append login/login.module.js
//@prepros-append login/loginCtrl.controller.js
//@prepros-append advices/advices.module.js
//@prepros-append advices/advicesCtrl.controller.js
//@prepros-append advices/advices.service.js
//@prepros-append advices/advice.filter.js
//@prepros-append advices/adviceCategory.directive.js

var app = angular.module('app', [
    'ngRoute',
    'global',
    'start',
    'login',
    'purr',
    'advices',
    'firebase'
]);


app.config(['$routeProvider', function($routeProvider) {

    $routeProvider

        .when('/', {templateUrl: './partials/login/loginscreen.html',controller:'loginCtrl'})

        .when('/advices', {templateUrl: './partials/advices/advices.html',controller:'advicesCtrl', resolve: {
            advices: function (Advices){

                return Advices.get()

            }
        }})

        .when('/404', {templateUrl: './partials/global/404.html',controller:'404Ctrl'})

        .otherwise({redirectTo: '/404'});
}]);




