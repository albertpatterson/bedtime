const Alarm = {state: 'none'};
const tab = require("../utils/tab");
const runtime = require("../utils/runtime");

const WARNING_NAME="AlarmWarning";
const ALARM_NAME="Alarm";
const MILIS_IN_MINUTE = 60*1000;
const MILIS_IN_HOUR=60*MILIS_IN_MINUTE;
const MILIS_IN_DAY=24*MILIS_IN_HOUR;
const Alarm_DURATION=MILIS_IN_MINUTE;
const WARNING_DURATION=MILIS_IN_MINUTE;

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

let AlarmCount = 0;

function getMilisTillAlarm(Alarm){
  let d=new Date();
  let AlarmParts = Alarm.time.split(":");
  let milisTillAlarm = (AlarmParts[0]-d.getHours())*MILIS_IN_HOUR+(AlarmParts[1]-d.getMinutes())*MILIS_IN_MINUTE;
  milisTillAlarm += milisTillAlarm<0 ? MILIS_IN_DAY : 0;
  return milisTillAlarm;
}

function isAlarmActiveToday(alarmData){
  let d=new Date(), today=days[d.getDay()];
  return AlarmDate.active(today);
}

function setDailyAlarm(name, milisFromNow){
  return chrome.alarms.create(name, {when: Date.now()+milisFromNow, periodInMinutes: 24*60});
}


module.exports = class DailyAlarmWithWarning{

  constructor(alarmData, onStartWarning, onStopWarning, onStartAlarm, onStopAlarm){
    this.alarmData = alarmData;
    this.state = "none";
    
    this._onStopWarning = onStopWarning;
    this._onStopAlarm = onStopAlarm;

    this._warningName = WARNING_NAME + AlarmCount;
    this._stopWarningTO = null;
    this._setupWarning(onStartWarning, onStopWarning);
    
    this._AlarmName = ALARM_NAME + AlarmCount;
    this._stopAlarmTO = null;
    this._setupAlarmAlarm(onStartAlarm, onStopAlarm);

    AlarmCount++;
  }

  _setupWarning(onStartWarning, onStopWarning){
    let milisTillAlarm = getMilisTillAlarm(this.alarmData),
        milisTillWarning = milisTillAlarm-Alarm_WARNINGS_DURATION;

    let stopWarnings = ()=>{
      onStopWarning();
      if(this.state==="warning") this.state="none";
    };

    let tryStartWarningsForDuration = (duration)=>{
      if(isAlarmActiveToday(this.alarmData)){
        onStartWarning();
        this.state="warning";
        this._stopWarningTO = setTimeout(stopWarnings, duration);
      }
    };

    if(milisTillWarning<0){
      tryStartWarningsForDuration(milisTillAlarm);
      milisTillWarning+=MILIS_IN_DAY;
    }

    let warning = setDailyAlarm(this._warningAlarmName, milisTillWarning);
    warning.onAlarm(()=>tryStartWarningsForDuration(WARNING_DURATION));
  }

  _setupAlarmAlarm(onStartAlarm, onStopAlarm) {
    let milisTillAlarm = getMilisTillAlarm(this.alarmData);

    let stopAlarm = ()=>{
      onStopAlarm();
      if(this.state==="alarm") this.state="none";

    };

    let tryStartAlarm = ()=>{
      if(isAlarmActiveToday(this.alarmData)){
        onStartAlarm();
        this.state="alarm";
        this._stopAlarmTO = setTimeout(stopAlarm, Alarm_DURATION);
      }
    };

    let alarm = setDailyAlarm(this._AlarmAlarmName, milisTillAlarm);
    alarm.onAlarm(tryStartAlarm);
  }

  clear(){
    chrome.alarms.clear(this._warningName);
    chrome.alarms.clear(this._AlarmName);
    clearTimeout(this._stopWarningTO);
    clearTimeout(this._stopAlarmTO);
    if(this.state==="warning"){
      this._onStopWarning();
    }else if(this.state==="alarm"){
      this._onStopAlarm()
    }
    this.state="none";
  }
};