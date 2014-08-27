advicesModule.factory('Advices', function ($firebase){

    var ref = $firebase (new Firebase (FIREBASE + '/treatments'));

    var treatments = ref.$asArray();

    return {

        data:[],

        get: function (){

            var self = this;

            treatments.$loaded()
                .then (function(res){
                    self.data = res;

            });

            return treatments.$loaded();

        },

        add: function(){



        }
    }
});