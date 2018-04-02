const DailyAlarmWithWarning = require("./DailyAlarmWithWarning");


module.exports = {
  alarms: [],
  add: function(alarmData){
    alarms.push(new DailyAlarmWithWarning(alarmData, this.onTryStartWarning, this.onTryStopWarning, this.onTryStartAlarm, this.onTryStopAlarm));
    stateCounts.none++;
  },
  remove: function(idx){
    alarms[idx].clear();
    alarms[idx]=null;
    stateCounts[alarm[idx].state]--;
  },
  onTryStartWarning(){
    if(getStateCounts().warning===0) this.doStartWarning();
  },
  onTryStopWarning(){
    if(getStateCounts().warning===1) this.doStopWarning();
  },
  onTryStartAlarm(){
    if(getStateCounts().alarm===0) this.doStartAlarm();
  },
  onTryStopAlarm(){
    if(getStateCounts().alarm===1) this.doStopAlarm();
  },
  getOverallState(){
    return alarms.reduce((overallState, alarm)=>{
      if(overallState==="alarm" || alarm.state==="alarm"){
        return "alarm";
      }else if(overallState==="warning" || alarm.state==="warning"){
        return "warning";
      }else{
        return "none";
      }
    }, {state: "none"})
  },
  getStateCounts(){
    stateCounts = {alarm: 0, warning: 0, none: 0};
    alarms.foreach((alarm) => {
      stateCounts[alarm.state]++
    });
    return stateCounts;
  }
};