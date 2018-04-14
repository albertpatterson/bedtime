(function(){


    const values = {};
    values.bedtimeIdsResource='bedtime-ids';
    values.bedtimeDataResource='bedtime-data';
    values.days=["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    values.milisInMinute=60*1000;
    values.milisInHour=60*values.milisInMinute;
    values.milisInDay=24*values.milisInHour;
    values.alarmDuration=values.milisInMinute;
    values.warningsDuration=2*values.milisInMinute;
    

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