const bedtime = {state: 'none'};
const tab = require("../utils/tab");
const runtime = require("../utils/runtime");

const BEDTIME_WARNING_ALARM_NAME="bedtimeWarning";
const BEDTIME_ALARM_NAME="bedtime";
const MILIS_IN_MINUTE = 60*1000;
const MILIS_IN_HOUR=60*MILIS_IN_MINUTE;
const MILIS_IN_DAY=24*MILIS_IN_HOUR;
const BEDTIME_DURATION=MILIS_IN_MINUTE;
const BEDTIME_WARNINGS_DURATION=MILIS_IN_MINUTE;
const BEDTIME_WARNINGS_OFFSET=MILIS_IN_MINUTE;

const DAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

let bedtimeCount = 0;

function setupBedtimeWarnings(milisTillBedtime){
    milisTillWarning = milisTillBedtime-BEDTIME_WARNINGS_OFFSET;
    if(milisTillWarning<0){
        beginWarnings(milisTillBedtime);
        milisTillWarning+=MILIS_IN_DAY;
    }

    setDailyAlarm(BEDTIME_WARNING_ALARM_NAME, milisTillWarning, ()=>beginWarnings(milisTillBedtime));
}

function beginWarnings(duration){
    duration = duration || BEDTIME_WARNINGS_OFFSET;
    tab.sendMessage('begin-bedtime-warning',{});
    if(bedtime.state!=="bedtime") bedtime.state="bedtime-warning";
    return setTimeout(endWarnings, duration);
}

function endWarnings(){
    tab.sendMessage('end-bedtime-warning',{});
    if(bedtime.state==="bedtime-warning") bedtime.state="none";
}

function beginBedtime(duration){
    duration = duration || BEDTIME_DURATION;
    tab.sendMessage('begin-bedtime',{});
    bedtime.state="bedtime";
    return setTimeout(endBedtime, duration);
}

function endBedtime(){
    tab.sendMessage('end-bedtime',{});
    if(bedtime.state==="bedtime") bedtime.state="none";
}

function getMilisTillBedtime(bedtime){
    let d=new Date();
    let bedtimeParts = bedtime.time.split(":");
    let milisTillBedtime = (bedtimeParts[0]-d.getHours())*MILIS_IN_HOUR+(bedtimeParts[1]-d.getMinutes())*MILIS_IN_MINUTE;
    milisTillBedtime += milisTillBedtime<0 ? MILIS_IN_DAY : 0;
    return milisTillBedtime;
}

function isAlarmActiveToday(bedtimeData){
    let d=new Date(), today=days[d.getDay()];
    return bedtimeDate.active(today);
}

function setDailyAlarm(name, when){
   return chrome.alarms.create(name, {when: Date.now()+when, periodInMinutes: 24*60});
}

chrome.alarms.onAlarm.addListener(function(alarm){
    if(alarm.name.startsWith(BEDTIME_WARNING_ALARM_NAME)){
        beginWarnings();
    }else if(alarm.name.startsWith(BEDTIME_ALARM_NAME)){
        beginBedtime();
    }
})

class Bedtime{
    
    constructor(bedtime){
        this.BEDTIME_WARNING_ALARM_NAME = BEDTIME_WARNING_ALARM_NAME+bedtimeCount;
        this.BEDTIME_ALARM_NAME = BEDTIME_ALARM_NAME+bedtimeCount;
        let milisTillBedtime = getMilisTillBedtime(bedtime);
        this._setupBedtimeWarnings(milisTillBedtime);
        this._setupBedtime(milisTillBedtime);
        bedtimeCount++;
    }

    _setupBedtimeWarnings(milisTillBedtime){
        let warningOffsetMilis = MILIS_IN_HOUR;
        let milisTillWarning = milisTillBedtime-warningOffsetMilis;
        if(milisTillWarning<0){
            this.bedtimeWarnCancelTO = beginWarnings(milisTillBedtime);
            milisTillWarning+=MILIS_IN_DAY;
        }
    
        setDailyAlarm(this.BEDTIME_WARNING_ALARM_NAME, milisTillWarning);
    }

    _setupBedtime(milisTillBedtime){
        setDailyAlarm(this.BEDTIME_ALARM_NAME, milisTillBedtime);
    }

    clear(){
        chrome.alarms.clear(this.BEDTIME_WARNING_ALARM_NAME);
        endWarnings();
        clearTimeout(this.bedtimeWarnCancelTO)
        chrome.alarms.clear(this.BEDTIME_ALARM_NAME);
        endBedtime();
        clearTimeout(bedtimeCancelTO);
    }
}

bedtime.Bedtime = Bedtime;

module.exports = bedtime;