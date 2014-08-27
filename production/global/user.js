globalModule.factory('user',function($firebaseSimpleLogin,$location,purr){

    var ref = new Firebase(FIREBASE);

    return{

        /**
         * Der FirebaseSimpleLogin gibt ein Referenzobjekt zurück welches etliche Methoden zur Interaktion mit dem
         * Benutzerverwaltungssystem. Weiterhin enthält es ein Objekt `user`. Ist kein Benutzer angemeldet ist der Wert dieses Objektes null,
         * andernfalls enthält es Meta- & Statusinformationen zum angemeldeten Benutzer
         */
        getReference: function(){
            return   $firebaseSimpleLogin(ref, function(error, user) {
                if (error) {
                    purr.info('Es liegt ein Problem mit dem Server vor. Bitte kontaktieren sie den Administrator');
                }
            });

        },

        login: function(alias,password){

            var auth = this.getReference();

            auth.$login('password', {
                email: alias,
                password: password
            })
                .then(function(res){
                    purr.success('Erfolgreich angemeldet');

                    /**
                     *
                     * Das Setzen der session uid dient lediglich zur Vereinfachung der Datenbankzugriffe
                     *
                     * Der globale service `user` gibt mittels user.id die provider id der Sitzung zurück um beispielsweise
                     * eine einfache Initialisierung zum Laden aller Sendungsinstanzen des momentan angemeldeten Benutzers durch den shipment service
                     * zu ermöglichen.
                     *
                     * Die Überprüfung der Echtheit und Validität der Sitzung erfolgt über das Firebase System und die dort festgelegten `Security rules'
                     *
                     */
                    localStorage['userid'] = res.uid;

                    $location.path('/advices');
                })
                .catch(function(res){
                    purr.error('Falscher Benutzername oder falsches Kennwort.')
                });

        },

        id: (function(){
            return localStorage['userid'];
        })()
    }



});