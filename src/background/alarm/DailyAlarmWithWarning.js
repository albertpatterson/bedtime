const Alarm = {state: 'none'};
const tab = require("../utils/tab");
const runtime = require("../../util/runtime");
const constants = require("../../util/constants");

const WARNING_NAME="AlarmWarning";
const ALARM_NAME="Alarm";

let AlarmCount = 0;

function getMilisTillAlarm(alarm){
  let d=new Date();
  let alarmParts = alarm.time.split(":");
  let milisTillAlarmToday = (alarmParts[0]-d.getHours())*constants.get('milisInHour')+(alarmParts[1]-d.getMinutes())*constants.get('milisInMinute');
  
  const today = d.getDay();

  // check if alarm is currently active
  const milisTillEndAlarmToday = milisTillAlarmToday+constants.get('alarmDuration');
  if(isAlarmActiveOnDay(alarm, today) && milisTillAlarmToday<0 && milisTillEndAlarmToday>0){
    return milisTillAlarmToday;
  }else{
    // find time when it is next active
    let activeDayFound = false;
    let daysTillAlarm = milisTillAlarmToday>0?0:1;
    while(!activeDayFound && daysTillAlarm<=7){
      if(isAlarmActiveOnDay(alarm, (today+daysTillAlarm)%7)){
        activeDayFound=true;
      }else{
        daysTillAlarm++;
      }
    }
  
    if(activeDayFound){
      return milisTillAlarmToday + daysTillAlarm*constants.get('milisInDay')
    }else{
      return Infinity;
    }
  }
}

function isAlarmActiveOnDay(alarmData, day){
  day = day || new Date().getDay();
  let d=new Date(), today=constants.get('days')[day];
  return alarmData.active[today];
}

function setDailyAlarm(name, milisFromNow){
  if(Number.isFinite(milisFromNow)){
    return chrome.alarms.create(name, {when: Date.now()+milisFromNow, periodInMinutes: 24*60});
  }
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
        milisTillWarning = milisTillAlarm-constants.get('warningsDuration');

    // setup the warning if it is currently active
    if(milisTillWarning<=0){
      if(milisTillAlarm>0){
        this._tryStartWarningForDuration(milisTillAlarm);
      }
      milisTillWarning+=constants.get('milisInDay');
    }

    setDailyAlarm(this._warningName, milisTillWarning);
  }

  _tryStartWarningForDuration(duration){
    let stopWarnings = ()=>{
      this._onStopWarning();
      if(this.state==="warning") this.state="none";
    };

    if(isAlarmActiveOnDay(this.alarmData)){
      this._onStartWarning();
      this.state="warning";
      this._stopWarningTO = setTimeout(stopWarnings, duration);
    }
  }

  _setupAlarm(onStartAlarm, onStopAlarm) {

    let milisTillAlarm = getMilisTillAlarm(this.alarmData),
        milisTillEndAlarm = milisTillAlarm+constants.get('alarmDuration');

    // setup alarm if it is currently active
    if(milisTillAlarm<=0){
      if(milisTillEndAlarm>0){
        this._tryStartAlarmForDuration(milisTillEndAlarm);
      }
      milisTillAlarm+=constants.get('milisInDay');
    }
    
    setDailyAlarm(this._alarmName, milisTillAlarm);
  }

  _tryStartAlarmForDuration(duration){

    duration = duration || constants.get('alarmDuration');

    let stopAlarm = ()=>{
      this._onStopAlarm();
      if(this.state==="alarm") this.state="none";
    };

    if(isAlarmActiveOnDay(this.alarmData)){
      this._onStartAlarm();
      this.state="alarm";
      this._stopAlarmTO = setTimeout(stopAlarm, duration);
    }
  }

  _listenForAlarms(alarm){
    if(alarm.name===this._alarmName){
      this._tryStartAlarmForDuration(constants.get('warningsDuration'));
    }else if(alarm.name===this._warningName){
      this._tryStartWarningForDuration(constants.get('warningsDuration'));
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