const DailyAlarmWithWarning = require("./DailyAlarmWithWarning");
const tab = require("../utils/tab");

const alarms = [];

function getStateCounts(){
  stateCounts = {alarm: 0, warning: 0, none: 0};
  alarms.forEach((alarm) => {
    stateCounts[alarm.state]++;
  });
  return stateCounts;
}

function tryStartWarning(){
  if(getStateCounts().warning===0) tab.sendMessage('begin-bedtime-warning', {});
}

function tryStopWarning(){
  if(getStateCounts().warning===1) tab.sendMessage('end-bedtime-warning', {});
}

function tryStartAlarm(){
  if(getStateCounts().alarm===0) tab.sendMessage('begin-bedtime', {});
}

function tryStopAlarm(){
  if(getStateCounts().alarm===1) tab.sendMessage('end-bedtime', {});
}

module.exports = {
  add: function(alarmData){
    alarms.push(new DailyAlarmWithWarning(alarmData, tryStartWarning, tryStopWarning, tryStartAlarm, tryStopAlarm));
  },
  getState(){
    let counts = getStateCounts();
    if(counts.alarm>0){
      return "bedtime";
    }else if(counts.warning>0){
      return "bedtime-warning";
    }else{
      return "none";
    }
  },
  remove: function(idx){
    alarms[idx].clear();
    alarms.splice(idx,1);
  },
  removeAll: function(){
    for(let idx=(alarms.length-1); idx>=0; idx--){
      this.remove(idx);
    }
  },
  getNearestBestTime(){
    alarmTimes = alarms.map(a=>a.alarmData.time);
    timesTillAlarm = alarms.map(a=>a.timeUntilAlarm());
    return alarmTimes[timesTillAlarm.reduce((minIdx, curIdx)=>timesTillAlarm[curIdx]<timesTillAlarm[minIdx]?curIdx:minIdx, 0)];
  }
};