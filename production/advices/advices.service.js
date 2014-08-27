advicesModule.factory('Advices', function ($firebase){

    var ref = $firebase (new Firebase (FIREBASE + '/treatments'));

    return {

        data:[],

        get: function (){
            var self = this;
            var treatments = ref.$asArray();

            treatments.$loaded()
                .then (function(res){
                    self.data = res

            });

            return treatments.$loaded();

        }
    }
});