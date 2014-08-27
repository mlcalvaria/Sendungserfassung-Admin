loginModule.controller('loginCtrl', function($scope, user){
   $scope.login = function (){
    user.login($scope.username, $scope.password)

   };
});