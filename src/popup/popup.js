(function(){

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    const inputs = {
        bedtime: document.getElementById("bedtime"),
        submit: document.getElementById("bedtime-submit")
    };
    days.forEach(day=>inputs[day]=document.getElementById(day));

    inputs.submit.onclick = submitBedtime;

    getBedtimeData(updateView);

    function updateView(bedtime){
        inputs.bedtime.value=bedtime.time;
        days.forEach(day=>inputs[day].checked=bedtime.active[day]);
    }

    function submitBedtime(){
        let bedtime={
            time: inputs.bedtime.value,
            active: {}
        };
        days.forEach(day=>bedtime.active[day]=inputs[day].checked);
        setBedtimeData(bedtime);
    }

    function getBedtimeData(callback){
        chrome.storage.sync.get(['bedtimes'], function(result) {
            bedtime=result.bedtimes[0];
            if(!(bedtime && bedtime.time)){
                bedtime = {time: undefined, active: {}};
                days.forEach(day=>bedtime.active[day]=false);
            }
            callback(bedtime);
          });
    }

    function setBedtimeData(bedtime){
        chrome.storage.sync.set({'bedtimes': [bedtime]});
        chrome.runtime.sendMessage("refresh-bedtime");
    }
})()