startModule.controller('startCtrl',function($scope,$location,$routeParams,Survey){

    $scope.year = $routeParams.year;

    $scope.startSurvey = function(){

        $location.path('/survey');

    }

});