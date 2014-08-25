












var app = angular.module('app', [
    'ngRoute',
    'global',
    'start',
    'purr'
]);

app.config(['$routeProvider', function($routeProvider) {

    $routeProvider

        .when('/', {templateUrl: './partials/start/start.html',controller:'startCtrl'})

        .when('/404', {templateUrl: './partials/global/404.html',controller:'404Ctrl'})

        .otherwise({redirectTo: '/404'});
}]);






var SERVER = {

};
var globalModule = angular.module('global',[]);
globalModule.service('toolkit',function(){

    return{

        /**
         * Returns the current date [YYYY-MM-DD or YYYY.MM.DD]
         *
         * @param altFormat - If true, replace '-' with '.'
         *
         * @returns {Date}
         */
        getDate: function(altFormat){
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1; //January is 0!

            var yyyy = today.getFullYear();
            if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = yyyy +'-'+ mm+'-'+dd;

            if(altFormat){
                today = today.replace(/-/g, '.');
            }

            return today;
        },

        /**
         *  Returns a 32 character ID [ XXXXXXXX - XXXXXXXXXXXXXXXXXXXXXXXX ]
         * @returns {string}
         */

        newGUID: function(){

            var result = '';
            var hexcodes = "0123456789abcdef".split("");

            for (var index = 0; index < 32; index++) {
                var value = Math.floor(Math.random() * 16);

                switch (index) {
                    case 8:
                        result += '-';
                        break;
                    case 12:
                        value = 4;
                        break;

                }
                result += hexcodes[value];
            }
            return result;
        },

        /**
         * A function that takes an object of data and returns those that are marked as checked by the user
         *
         * @param list
         * @returns {Array}
         */
        getCheckedElements: function(list){
            var checkedElements = [];

            for (var element in list){

                if(list[element].hasOwnProperty('isChecked')){
                    if(list[element].isChecked == true){
                        checkedElements.push(list[element].ident || list[element].informations.identnumber);
                    }
                }
            }

            return checkedElements;
        }

    };
});
globalModule.directive('setFocus',function(){

    return{
        restrict: 'A',
        link: function(scope,element){
            element[0].focus();
        }
    }

});
/**
 * The following features are still outstanding: animation as a
 * function, placement as a function, inside, support for more triggers than
 * just mouse enter/leave, html tooltips, and selector delegation.
 */
globalModule

    .factory('$position', ['$document', '$window', function ($document, $window) {

        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * Checks if a given element is statically positioned
         * @param element - raw DOM element
         */
        function isStaticPositioned(element) {
            return (getStyle(element, 'position') || 'static' ) === 'static';
        }

        /**
         * returns the closest, non-statically positioned parentOffset of a given element
         * @param element
         */
        var parentOffsetEl = function (element) {
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        return {
            /**
             * Provides read-only equivalent of jQuery's position function:
             * http://api.jquery.com/position/
             */
            position: function (element) {
                var elBCR = this.offset(element);
                var offsetParentBCR = { top: 0, left: 0 };
                var offsetParentEl = parentOffsetEl(element[0]);
                if (offsetParentEl != $document[0]) {
                    offsetParentBCR = this.offset(angular.element(offsetParentEl));
                    offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
                    offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
                }

                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: elBCR.top - offsetParentBCR.top,
                    left: elBCR.left - offsetParentBCR.left
                };
            },

            /**
             * Provides read-only equivalent of jQuery's offset function:
             * http://api.jquery.com/offset/
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect();
                return {
                    width: boundingClientRect.width || element.prop('offsetWidth'),
                    height: boundingClientRect.height || element.prop('offsetHeight'),
                    top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
                    left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
                };
            },

            /**
             * Provides coordinates for the targetEl in relation to hostEl
             */
            positionElements: function (hostEl, targetEl, positionStr, appendToBody) {

                var positionStrParts = positionStr.split('-');
                var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

                var hostElPos,
                    targetElWidth,
                    targetElHeight,
                    targetElPos;

                hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

                targetElWidth = targetEl.prop('offsetWidth');
                targetElHeight = targetEl.prop('offsetHeight');

                var shiftWidth = {
                    center: function () {
                        return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
                    },
                    left: function () {
                        return hostElPos.left;
                    },
                    right: function () {
                        return hostElPos.left + hostElPos.width;
                    }
                };

                var shiftHeight = {
                    center: function () {
                        return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
                    },
                    top: function () {
                        return hostElPos.top;
                    },
                    bottom: function () {
                        return hostElPos.top + hostElPos.height;
                    }
                };

                switch (pos0) {
                    case 'right':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: shiftWidth[pos0]()
                        };
                        break;
                    case 'left':
                        targetElPos = {
                            top: shiftHeight[pos1](),
                            left: hostElPos.left - targetElWidth
                        };
                        break;
                    case 'bottom':
                        targetElPos = {
                            top: shiftHeight[pos0](),
                            left: shiftWidth[pos1]()
                        };
                        break;
                    default:
                        targetElPos = {
                            top: hostElPos.top - targetElHeight,
                            left: shiftWidth[pos1]()
                        };
                        break;
                }

                return targetElPos;
            }
        };
    }])

    .provider( '$tooltip', function () {
        // The default options tooltip and popover.
        var defaultOptions = {
            placement: 'top',
            animation: true,
            popupDelay: 0
        };

        // Default hide triggers for each show trigger
        var triggerMap = {
            'mouseenter': 'mouseleave',
            'click': 'click',
            'focus': 'blur'
        };

        // The options specified to the provider globally.
        var globalOptions = {};

        /**
         * `options({})` allows global configuration of all tooltips in the
         * application.
         *
         *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
         */
        this.options = function( value ) {
            angular.extend( globalOptions, value );
        };

        /**
         * This allows you to extend the set of trigger mappings available. E.g.:
         *
         *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
         */
        this.setTriggers = function setTriggers ( triggers ) {
            angular.extend( triggerMap, triggers );
        };

        /**
         * This is a helper function for translating camel-case to snake-case.
         */
        function snake_case(name){
            var regexp = /[A-Z]/g;
            var separator = '-';
            return name.replace(regexp, function(letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        }

        /**
         * Returns the actual instance of the $tooltip service.
         * TODO support multiple triggers
         */
        this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', '$interpolate', function ( $window, $compile, $timeout, $parse, $document, $position, $interpolate ) {
            return function $tooltip ( type, prefix, defaultTriggerShow ) {
                var options = angular.extend( {}, defaultOptions, globalOptions );

                /**
                 * Returns an object of show and hide triggers.
                 *
                 * If a trigger is supplied,
                 * it is used to show the tooltip; otherwise, it will use the `trigger`
                 * option passed to the `$tooltipProvider.options` method; else it will
                 * default to the trigger supplied to this directive factory.
                 *
                 * The hide trigger is based on the show trigger. If the `trigger` option
                 * was passed to the `$tooltipProvider.options` method, it will use the
                 * mapped trigger from `triggerMap` or the passed trigger if the map is
                 * undefined; otherwise, it uses the `triggerMap` value of the show
                 * trigger; else it will just use the show trigger.
                 */
                function getTriggers ( trigger ) {
                    var show = trigger || options.trigger || defaultTriggerShow;
                    var hide = triggerMap[show] || show;
                    return {
                        show: show,
                        hide: hide
                    };
                }

                var directiveName = snake_case( type );

                var startSym = $interpolate.startSymbol();
                var endSym = $interpolate.endSymbol();
                var template =
                    '<div '+ directiveName +'-popup '+
                    'title="'+startSym+'tt_title'+endSym+'" '+
                    'content="'+startSym+'tt_content'+endSym+'" '+
                    'placement="'+startSym+'tt_placement'+endSym+'" '+
                    'animation="tt_animation" '+
                    'is-open="tt_isOpen"'+
                    '>'+
                    '</div>';

                return {
                    restrict: 'EA',
                    scope: true,
                    compile: function (tElem, tAttrs) {
                        var tooltipLinker = $compile( template );

                        return function link ( scope, element, attrs ) {
                            var tooltip;
                            var transitionTimeout;
                            var popupTimeout;
                            var appendToBody = angular.isDefined( options.appendToBody ) ? options.appendToBody : false;
                            var triggers = getTriggers( undefined );
                            var hasEnableExp = angular.isDefined(attrs[prefix+'Enable']);

                            var positionTooltip = function () {

                                var ttPosition = $position.positionElements(element, tooltip, scope.tt_placement, appendToBody);
                                ttPosition.top += 'px';
                                ttPosition.left += 'px';

                                // Now set the calculated positioning.
                                tooltip.css( ttPosition );
                            };

                            // By default, the tooltip is not open.
                            // TODO add ability to start tooltip opened
                            scope.tt_isOpen = false;

                            function toggleTooltipBind () {
                                if ( ! scope.tt_isOpen ) {
                                    showTooltipBind();
                                } else {
                                    hideTooltipBind();
                                }
                            }

                            // Show the tooltip with delay if specified, otherwise show it immediately
                            function showTooltipBind() {
                                if(hasEnableExp && !scope.$eval(attrs[prefix+'Enable'])) {
                                    return;
                                }
                                if ( scope.tt_popupDelay ) {
                                    // Do nothing if the tooltip was already scheduled to pop-up.
                                    // This happens if show is triggered multiple times before any hide is triggered.
                                    if (!popupTimeout) {
                                        popupTimeout = $timeout( show, scope.tt_popupDelay, false );
                                        popupTimeout.then(function(reposition){reposition();});
                                    }
                                } else {
                                    show()();
                                }
                            }

                            function hideTooltipBind () {
                                scope.$apply(function () {
                                    hide();
                                });
                            }

                            // Show the tooltip popup element.
                            function show() {

                                popupTimeout = null;

                                // If there is a pending remove transition, we must cancel it, lest the
                                // tooltip be mysteriously removed.
                                if ( transitionTimeout ) {
                                    $timeout.cancel( transitionTimeout );
                                    transitionTimeout = null;
                                }

                                // Don't show empty tooltips.
                                if ( ! scope.tt_content ) {
                                    return angular.noop;
                                }

                                createTooltip();

                                // Set the initial positioning.
                                tooltip.css({ top: 0, left: 0, display: 'block' });

                                // Now we add it to the DOM because need some info about it. But it's not
                                // visible yet anyway.
                                if ( appendToBody ) {
                                    $document.find( 'body' ).append( tooltip );
                                } else {
                                    element.after( tooltip );
                                }

                                positionTooltip();

                                // And show the tooltip.
                                scope.tt_isOpen = true;
                                scope.$digest(); // digest required as $apply is not called

                                // Return positioning function as promise callback for correct
                                // positioning after draw.
                                return positionTooltip;
                            }

                            // Hide the tooltip popup element.
                            function hide() {
                                // First things first: we don't show it anymore.
                                scope.tt_isOpen = false;

                                //if tooltip is going to be shown after delay, we must cancel this
                                $timeout.cancel( popupTimeout );
                                popupTimeout = null;

                                // And now we remove it from the DOM. However, if we have animation, we
                                // need to wait for it to expire beforehand.
                                // FIXME: this is a placeholder for a port of the transitions library.
                                if ( scope.tt_animation ) {
                                    if (!transitionTimeout) {
                                        transitionTimeout = $timeout(removeTooltip, 500);
                                    }
                                } else {
                                    removeTooltip();
                                }
                            }

                            function createTooltip() {
                                // There can only be one tooltip element per directive shown at once.
                                if (tooltip) {
                                    removeTooltip();
                                }
                                tooltip = tooltipLinker(scope, function () {});

                                // Get contents rendered into the tooltip
                                scope.$digest();
                            }

                            function removeTooltip() {
                                transitionTimeout = null;
                                if (tooltip) {
                                    tooltip.remove();
                                    tooltip = null;
                                }
                            }

                            /**
                             * Observe the relevant attributes.
                             */
                            attrs.$observe( type, function ( val ) {
                                scope.tt_content = val;

                                if (!val && scope.tt_isOpen ) {
                                    hide();
                                }
                            });

                            attrs.$observe( prefix+'Title', function ( val ) {
                                scope.tt_title = val;
                            });

                            attrs.$observe( prefix+'Placement', function ( val ) {
                                scope.tt_placement = angular.isDefined( val ) ? val : options.placement;
                            });

                            attrs.$observe( prefix+'PopupDelay', function ( val ) {
                                var delay = parseInt( val, 10 );
                                scope.tt_popupDelay = ! isNaN(delay) ? delay : options.popupDelay;
                            });

                            var unregisterTriggers = function () {
                                element.unbind(triggers.show, showTooltipBind);
                                element.unbind(triggers.hide, hideTooltipBind);
                            };

                            attrs.$observe( prefix+'Trigger', function ( val ) {
                                unregisterTriggers();

                                triggers = getTriggers( val );

                                if ( triggers.show === triggers.hide ) {
                                    element.bind( triggers.show, toggleTooltipBind );
                                } else {
                                    element.bind( triggers.show, showTooltipBind );
                                    element.bind( triggers.hide, hideTooltipBind );
                                }
                            });

                            var animation = scope.$eval(attrs[prefix + 'Animation']);
                            scope.tt_animation = angular.isDefined(animation) ? !!animation : options.animation;

                            attrs.$observe( prefix+'AppendToBody', function ( val ) {
                                appendToBody = angular.isDefined( val ) ? $parse( val )( scope ) : appendToBody;
                            });

                            // if a tooltip is attached to <body> we need to remove it on
                            // location change as its parent scope will probably not be destroyed
                            // by the change.
                            if ( appendToBody ) {
                                scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess () {
                                    if ( scope.tt_isOpen ) {
                                        hide();
                                    }
                                });
                            }

                            // Make sure tooltip is destroyed and removed.
                            scope.$on('$destroy', function onDestroyTooltip() {
                                $timeout.cancel( transitionTimeout );
                                $timeout.cancel( popupTimeout );
                                unregisterTriggers();
                                removeTooltip();
                            });
                        };
                    }
                };
            };
        }];
    })

    .directive( 'tooltipPopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
            templateUrl: './partials/global/tooltip.html'
        };
    })

    .directive( 'tooltip', [ '$tooltip', function ( $tooltip ) {
        return $tooltip( 'tooltip', 'tooltip', 'mouseenter' );
    }])

    .directive( 'tooltipHtmlUnsafePopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
            templateUrl: 'template/tooltip/tooltip-html-unsafe-popup.html'
        };
    })

    .directive( 'tooltipHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
        return $tooltip( 'tooltipHtmlUnsafe', 'tooltip', 'mouseenter' );
    }]);
globalModule.provider('Info',function(){

    this.$get = function(){

        return{
            message:'',
            isOpen: false,
            close: function(){
                this.isOpen = false;
            },
            open: function(){
                this.isOpen = true;
            },
            parseMessage: function(message){
                var description = '<p>' + message.description + '</p>'

                var links = '<ul class="info-linklist">';

                for(var link in message.links){
                    links += ('<li class="icon-arrow-right info-link"><a href="'+ message.links[link] +'"> ' + link + '</a></li>');
                }

                links += '</ul>';

                this.message = description + links;
            }
        }

    }

});
globalModule.directive('info',function(){

    return{

        restrict: 'E',
        replace: true,
        templateUrl: './partials/global/infoButton.html',
        scope:{
            data: '='
        },
        controller: function($scope,Info){

            $scope.openModal = function(e){

                e.stopPropagation();

                Info.parseMessage($scope.data);

                Info.open();

            }

        }
    }

});
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
globalModule.controller('404Ctrl',function(){

});
var startModule = angular.module('start',[]);
startModule.controller('startCtrl',function($scope,$location,$routeParams,Survey){

    $scope.year = $routeParams.year;

    $scope.startSurvey = function(){

        $location.path('/survey');

    }

});