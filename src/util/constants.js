(function(){

    const values = {
        bedtimeIdsResource: 'bedtime-ids',
        bedtimeDataResource: 'bedtime-data',
        days: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }

    const constants = {
        get: function(name){
            return values[name];
        }
    }

    if(typeof app === "undefined"){
        module.exports = constants;
    }else{
        app.constants = constants;
    }
})()