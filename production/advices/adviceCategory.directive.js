advicesModule.directive ('adviceCategory', function (Advices){
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'partials/advices/adviceCategory.html',
        link: function(scope, element, atrs){
            scope.category = {
                name: atrs.val,
                data: Advices.data,
                open: false
            };
            scope.toggle = function (){
                scope.category.open = !scope.category.open;
            }

        }
}
});