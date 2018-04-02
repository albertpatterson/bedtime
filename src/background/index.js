const tab = require("./utils/tab");
const runtime = require("./utils/runtime");
const bedtime = require("./bedtime/bedtime");
const Bedtime = bedtime.Bedtime;

const BEDTIME_WARNING_ALARM_NAME="bedtimeWarning";
const BEDTIME_ALARM_NAME="bedtime";
const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

let bedtimeStr = '';
chrome.commands.onCommand.addListener(function(command) {
    if(command==="test"){       

        let d=new Date();
        let hour=d.getHours(), min=d.getMinutes();
        let bedtimeHour = min===59?hour+1:hour;
        let bedtimeMin =  min===59?0:min+1;
        bedtimeStr = bedtimeHour+":"+bedtimeMin;
        console.log("begin test at "+bedtimeStr);
        let bedtimeData = {
            time: bedtimeStr,
            active: {}
        };
        DAYS.forEach(day=>bedtimeData.active[day]=true);
        let bedtime = new Bedtime(bedtimeData);
    }
});

getBedtimeData(function(bedtimeData){
    bedtimeStr = bedtimeData.time;
    if(bedtimeStr){
      let bedtime = new Bedtime(bedtimeData);
    }
});

runtime.addListener(function(message, sender, sendResponse){
    if(message==='query-bedtime'){
        sendResponse({time: bedtimeStr, state: bedtime.state});
    }
});

// setup bedtime for new data
function getBedtimeData(callback){
    chrome.storage.sync.get(['bedtime'], function(result) {
        let bedtime=result.bedtime; 
        if(!(bedtime && bedtime.time)){
            bedtime = {time: undefined, active: {}};
            DAYS.forEach(day=>bedtime.active[day]=false);
        }
        callback(bedtime);
      });
}















// const tab = require("./utils/tab");

// const BEDTIME_WARNING_ALARM_NAME="bedtimeWarning"
// const BEDTIME_ALARM_NAME="bedtime";
// const MILIS_IN_MINUTE = 60*1000;
// const MILIS_IN_HOUR=60*MILIS_IN_MINUTE;
// const MILIS_IN_DAY=24*MILIS_IN_HOUR;

// getBedtimeData(function(bedtime){
//     let milisTillBedtime = getMilisTillBedtime(bedtime);
//     setupBedtimeWarnings(milisTillBedtime);
//     setupBedtime(milisTillBedtime);
// })

// function setupBedtimeWarnings(milisTillBedtime){
//     let warningOffsetMilis = MILIS_IN_HOUR;
//     milisTillWarning = milisTillBedtime-warningOffsetMilis;
//     if(milisTillWarning<0){
//         beginWarnings();
//         milisTillWarning+=MILIS_IN_DAY;
//     }

//     setDailyAlarm(BEDTIME_WARNING_ALARM_NAME, milisTillWarning, ()=>beginWarnings(milisTillBedtime));
// }

// function beginWarnings(duration){

// }

// function cancelWarnings(){

// }

// function setupBedtime(milisTillBedtime){
//     let sleepTime = 4*MILIS_IN_HOUR;
//     setDailyAlarm(BEDTIME_ALARM_NAME, milisTillBedtime, ()=>beginBedtime(sleepTime));
// }

// function beginBedtime(endTime){

// }

// function cancelBedtime(){

// }


// function getMilisTillBedtime(bedtime){
//     let d=new Date();
//     let bedtimeParts = bedtime.time.split(":");
//     let milisTillBedtime = (bedtimeParts[0]-d.getHours())*MILIS_IN_HOUR+(bedtimeParts[1]-d.getMinutes())*MILIS_IN_MINUTE;
//     milisTillBedtime += milisTillBedtime<0 ? MILIS_IN_DAY : 0;
//     return milisTillBedtime;
// }

// function setDailyAlarm(name, when, callback){
//     return chrome.alarms.create(name, {when: time, periodInMinutes: 24*60})
// }

// function getBedtimeData(callback){
//     chrome.storage.sync.get(['bedtime'], function(result) {
//         bedtime=result.bedtime; 
//         if(!(bedtime && bedtime.time)){
//             bedtime = {time: undefined, active: {}};
//             days.forEach(day=>bedtime.active[day]=false);
//         }
//         callback(bedtime);
//       });
// }
// // chrome.browserAction.onClicked.addListener(function(){
// //     tab.sendMessage('toggle')
// // })