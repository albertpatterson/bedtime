const DailyAlarmWithWarning = require("./DailyAlarmWithWarning");


module.exports = {
  alarms: [],
  add: function(alarmData){
    alarms.push(new DailyAlarmWithWarning(alarmData, this.onTryStartWarning, this.onTryStopWarning, this.onTryStartAlarm, this.onTryStopAlarm));
  },
  remove: function(idx){
    alarms[idx].clear();
    alarms[idx]=null;
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
  getStateCounts(){
    stateCounts = {alarm: 0, warning: 0, none: 0};
    alarms.foreach((alarm) => {
      stateCounts[alarm.state]++;
    });
    return stateCounts;
  }
};