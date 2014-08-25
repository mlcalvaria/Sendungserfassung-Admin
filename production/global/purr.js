"use strict";

var purr = angular.module('purr', []);
purr.directive('purr',function(purr){
    return{
        restrict: 'EA',
        scope: {},
        templateUrl: "partials/assets/purr.html",
        controller: 'purrController'
    }
});
purr.controller('purrController',function($scope,purr){

    $scope.notificationQueue = purr.getNotificationQueue();
    $scope.interceptionQueue = purr.getInterceptionQueue();

});

purr.provider('purr',function(){

    // used to access the configured options later
    var module = this;

    /**
     * used to configure the options
     *
     * Currently available properties:
     *
     *  # timeout - The time until a notification is killed in ms. If it is a interception, it will be rejected
     *
     */
    this.options = {};

    this.$get = function($timeout,$q){

        var self = this;

        // used to return promises via interceptions
        var defer = $q.defer();

        // contains all currently active notifications (bound to controller´)
        var notificationQueue = [];

        // contains all currently active interceptions (bound to controller´)
        var interceptionQueue = [];

        // used to assign to a timeout. If an interception is resolved/rejected manually, this reference is used to cancel the timeout
        var timer;

        var types = {

            'info': {
                'icon': 'fa-info',
                'class': 'purr-info',
                'type': 'Information'
            },

            'warning': {
                'icon': 'fa-warning',
                'class': 'purr-warning',
                'type': 'Warning'
            },

            'error': {
                'icon': 'fa-exclamation',
                'class': 'purr-error',
                'type': 'Failure'
            },

            'success': {
                'icon': 'fa-check',
                'class': 'purr-success',
                'type': 'Success'
            }

        };

        /**
         * Creates a notification of the given type and shows it
         *
         * @param msg  - The message that shall be displayed
         * @param type - The type of the notification
         */
        var createNotification = function(msg,type){

            var defaults = {
                'message': "No message given. Please report this issue.",
                'icon': 'fa-info'
            };

            // Used if no timeout span was specified
            var settings = {
                'timeout': 5000
            };

            settings = angular.extend(settings, module.options);

            var notification = angular.extend(types[type],{message: msg || this.defaults.message});

            notificationQueue.push(notification);

            //Todo: remove only one item
            $timeout(function(){
                notificationQueue.length = 0;
            },settings.timeout);

        };

        /**
         * Will provide an instance of an interception
         *
         *
         * @param msg
         * @param appr
         * @param decl
         * @constructor
         */
        function Interception(msg,appr,decl){

            this.message = msg;

            this.approval = {
                caption: appr,
                fire: function(){
                    defer.resolve('yup');
                    interceptionQueue.length = 0;
                    resetPromise();
                    $timeout.cancel(timer);
                }
            };

            this.decline = {
                caption: decl,
                fire: function(){
                    defer.reject('nope');
                    interceptionQueue.length = 0;
                    resetPromise();
                    $timeout.cancel(timer);
                }
            };
        }

        function resetPromise(){
            defer = $q.defer();
        }

        return{

            getNotificationQueue: function(){
                return notificationQueue;
            },
            getInterceptionQueue: function(){
                return interceptionQueue;
            },
            info: function(msg){
                createNotification(msg,'info');
            },
            warning: function(msg){
                createNotification(msg,'warning');
            },
            success: function(msg){
                createNotification(msg,'success');
            },
            error: function(msg){
                createNotification(msg,'error');
            },
            intercept: function(msg,appr,decl){

                var interception = new Interception(msg,appr,decl);

                interceptionQueue.push(interception);

                timer = $timeout(function(){},5000);

                timer
                    .then(function(){
                        if(interceptionQueue.length){
                            defer.reject('timeout');
                            interceptionQueue.length = 0;
                            resetPromise();
                        }
                    });

                return defer.promise;

            }
        }

    }

});