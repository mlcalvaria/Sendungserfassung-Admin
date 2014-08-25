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