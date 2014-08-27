advicesModule.filter ('advicefilter', function(){

    return function(items, category){

        var results = [];


        items.forEach(function(item, ind, array){
            if (category == item.category){
                results.push(item);
            }
        });

        return results;


    }


});


