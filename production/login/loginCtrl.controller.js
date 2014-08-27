loginModule.controller('loginCtrl', function($scope, user){
   $scope.login = function (){
    user.login($scope.username, $scope.password);
    console.log('123');
   };

    $scope.myFunction = function(){
        console.log('foobar');
    };

});