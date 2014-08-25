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