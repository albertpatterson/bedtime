const Alarm = {state: 'none'};
const tab = require("../utils/tab");
const runtime = require("../utils/runtime");

const WARNING_NAME="AlarmWarning";
const ALARM_NAME="Alarm";
const MILIS_IN_MINUTE = 60*1000;
const MILIS_IN_HOUR=60*MILIS_IN_MINUTE;
const MILIS_IN_DAY=24*MILIS_IN_HOUR;
const ALARM_DURATION=MILIS_IN_MINUTE;
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
  let d=new Date(), today=DAYS[d.getDay()];
  return alarmData.active[today];
}

function setDailyAlarm(name, milisFromNow){
  return chrome.alarms.create(name, {when: Date.now()+milisFromNow, periodInMinutes: 24*60});
}

module.exports = class DailyAlarmWithWarning{

  constructor(alarmData, onStartWarning, onStopWarning, onStartAlarm, onStopAlarm){
    this.alarmData = alarmData;
    this.state = "none";

    this._onStartWarning = onStartWarning;
    this._onStopWarning = onStopWarning;
    this._onStartAlarm = onStartAlarm;
    this._onStopAlarm = onStopAlarm;

    this._warningName = WARNING_NAME + AlarmCount;
    this._stopWarningTO = null;
    this._setupWarning();
    
    this._alarmName = ALARM_NAME + AlarmCount;
    this._stopAlarmTO = null;
    this._setupAlarm();

    chrome.alarms.onAlarm.addListener(this._listenForAlarms.bind(this));
    AlarmCount++;
  }

  timeUntilAlarm(){
    return getMilisTillAlarm(this.alarmData);
  }

  _setupWarning(){
    let milisTillAlarm = getMilisTillAlarm(this.alarmData),
        milisTillWarning = milisTillAlarm-WARNING_DURATION;

    if(milisTillWarning<=0){
      this._tryStartWarningForDuration(milisTillAlarm);
      milisTillWarning+=MILIS_IN_DAY;
    }

    setDailyAlarm(this._warningName, milisTillWarning);
  }

  _tryStartWarningForDuration(duration){
    let stopWarnings = ()=>{
      this._onStopWarning();
      if(this.state==="warning") this.state="none";
    };

    if(isAlarmActiveToday(this.alarmData)){
      this._onStartWarning();
      this.state="warning";
      this._stopWarningTO = setTimeout(stopWarnings, duration);
    }
  }

  _setupAlarm(onStartAlarm, onStopAlarm) {
    let milisTillAlarm = getMilisTillAlarm(this.alarmData);
    setDailyAlarm(this._alarmName, milisTillAlarm);
  }

  _tryStartAlarmForDuration(){
    let stopAlarm = ()=>{
      this._onStopAlarm();
      if(this.state==="alarm") this.state="none";
    };

    if(isAlarmActiveToday(this.alarmData)){
      this._onStartAlarm();
      this.state="alarm";
      this._stopAlarmTO = setTimeout(stopAlarm, ALARM_DURATION);
    }
  }

  _listenForAlarms(alarm){
    if(alarm.name===this._alarmName){
      this._tryStartAlarmForDuration(WARNING_DURATION);
    }else if(alarm.name===this._warningName){
      this._tryStartWarningForDuration(WARNING_DURATION);
    }
  }

  clear(){
    chrome.alarms.onAlarm.removeListener(this._listenForAlarms);
    chrome.alarms.clear(this._warningName);
    chrome.alarms.clear(this._alarmName);
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