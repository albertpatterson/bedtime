const DailyAlarmWithWarning = require("./DailyAlarmWithWarning");
const tab = require("../utils/tab");

const alarms = {};

function getStateCounts(){
  stateCounts = {alarm: 0, warning: 0, none: 0};
  for(id in alarms) stateCounts[alarms[id].state]++;
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
  update: function(id, data){
    if(alarms[id]) alarms[id].clear();
    alarms[id]=new DailyAlarmWithWarning(data, tryStartWarning, tryStopWarning, tryStartAlarm, tryStopAlarm);
    console.log('alarms: ', alarms)
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
  remove: function(id){
    if(alarms[id]){
      alarms[id].clear();
      delete alarms[id];
      console.log(alarms);
    }
  },
  removeAll: function(){
    for(id in alarms) this.remove(id);
  },
  getNearestBestTime(){    
    const ids = Object.keys(alarms);
    const timesTillAlarm = ids.map(id=>alarms[id].timeUntilAlarm());
    let minIdx = 0;
    for(let curIdx = 1; curIdx<timesTillAlarm.length; curIdx++){
      minIdx = timesTillAlarm[curIdx]<timesTillAlarm[minIdx]?curIdx:minIdx;
    }
    return alarms[ids[minIdx]].alarmData.time
  }
};