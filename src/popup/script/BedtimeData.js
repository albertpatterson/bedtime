(function(){

    class BedtimeData{
     constructor(time, active){//activeSunday, activeMonday,activeTuesday,activeWednesday,activeThursday,activeFriday,activeSaturday){
        this.time=time;
        this.active = active;
     }
    }

    app.BedtimeData = BedtimeData;
})()