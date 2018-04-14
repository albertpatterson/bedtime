const runtime = require("../util/runtime");
const constants = require("../util/constants");

const dataManager = require("./data/dataManager");
const bedtimeAlarmsManager = require("./alarm/bedtimeAlarmsManager");

const days = constants.get('days');

// let bedtimeStr = '';
// chrome.commands.onCommand.addListener(function(command) {
//     if(command==="test"){

//         let d=new Date();
//         let hour=d.getHours(), min=d.getMinutes();
//         let bedtimeHour = min===59?hour+1:hour;
//         let bedtimeMin =  min===59?0:min+1;
//         bedtimeStr = bedtimeHour+":"+bedtimeMin;
//         console.log("begin test at "+bedtimeStr);
//         let bedtimeData = {
//             time: bedtimeStr,
//             active: {}
//         };
//         DAYS.forEach(day=>bedtimeData.active[day]=true);
//         bedtimeAlarmsManager.add(bedtimeData);
//     }
// });

refreshBedtimes();

function refreshBedtimes() {
  bedtimeAlarmsManager.removeAll();

  // // setup bedtime for new data
  // chrome.storage.sync.get(['bedtimes'], function (result) {
  //   let bedtimes = result.bedtimes;
  //   console.log(bedtimes)
  //   if(bedtimes) bedtimes.forEach(bedtimeAlarmsManager.update)
  // });

  dataManager.ids.get()
  .then(ids=>{
    console.log("setup ids: ", ids);
    ids.forEach(id => {
      dataManager.bedtime.get(id)
      .then(data=>{
        return bedtimeAlarmsManager.update(id, data);
      })
    });
  })
}

runtime.addListener(function(message, sender, sendResponse){
    if(message==='query-bedtime'){
      sendResponse({time: bedtimeAlarmsManager.getNearestBestTime(), state: bedtimeAlarmsManager.getState()});
    }else if(message === "refresh-bedtime"){
      refreshBedtimes()
    }
});


const idsResource = constants.get("bedtimeIdsResource");
const dataResource = constants.get("bedtimeDataResource");
runtime.addListener(function(message, sender, sendResponse){
  console.log('got message ', message)
  let {resource, id, action, value} = message;
  switch(resource){
    case idsResource:
      if(action==='get'){
        dataManager.ids.get().then(sendResponse);
      }else{
        sendResponse(new Error("invalid message for ids"))
      }
      break;
    case dataResource:
      if(action==='get'){
        dataManager.bedtime.get(id).then(sendResponse);
      }else if(action==='set'){
        dataManager.bedtime.set(id, value)
        .then(()=>{
          bedtimeAlarmsManager.update(id, value);
          sendResponse();
        });
      }else if(action==='add'){
        dataManager.bedtime.add()
        .then(id=>{
          console.log('id is ', id, Date.now());
           sendResponse(id)
        });
      }else if(action==='remove'){
        dataManager.bedtime.remove(id)
        .then(()=>{
          bedtimeAlarmsManager.remove(id);
          sendResponse();
        });
      }else{
        sendResponse(new Error("invalid message for data"))
      }
      break;
    default:
      sendResponse(new Error("invalid message "+message+" sender: ",sender))
      break;
  }
  return true;
})


// const tab = require("./utils/tab");
// const runtime = require("./utils/runtime");
// const bedtime = require("./bedtime/bedtime");
// const Bedtime = bedtime.Bedtime;
//
// const BEDTIME_WARNING_ALARM_NAME="bedtimeWarning";
// const BEDTIME_ALARM_NAME="bedtime";
// const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
//
// let bedtimeStr = '';
// chrome.commands.onCommand.addListener(function(command) {
//     if(command==="test"){
//
//         let d=new Date();
//         let hour=d.getHours(), min=d.getMinutes();
//         let bedtimeHour = min===59?hour+1:hour;
//         let bedtimeMin =  min===59?0:min+1;
//         bedtimeStr = bedtimeHour+":"+bedtimeMin;
//         console.log("begin test at "+bedtimeStr);
//         let bedtimeData = {
//             time: bedtimeStr,
//             active: {}
//         };
//         DAYS.forEach(day=>bedtimeData.active[day]=true);
//         let bedtime = new Bedtime(bedtimeData);
//     }
// });
//
// getBedtimeData(function(bedtimeData){
//     bedtimeStr = bedtimeData.time;
//     if(bedtimeStr){
//       let bedtime = new Bedtime(bedtimeData);
//     }
// });
//
// runtime.addListener(function(message, sender, sendResponse){
//     if(message==='query-bedtime'){
//         sendResponse({time: bedtimeStr, state: bedtime.state});
//     }
// });
//
// // setup bedtime for new data
// function getBedtimeData(callback){
//     chrome.storage.sync.get(['bedtime'], function(result) {
//         let bedtime=result.bedtime;
//         if(!(bedtime && bedtime.time)){
//             bedtime = {time: undefined, active: {}};
//             DAYS.forEach(day=>bedtime.active[day]=false);
//         }
//         callback(bedtime);
//       });
// }















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