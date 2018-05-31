const runtime = require("../util/runtime");
const constants = require("../util/constants");

const dataManager = require("./data/dataManager");
const bedtimeAlarmsManager = require("./alarm/bedtimeAlarmsManager");

const days = constants.get('days');

refreshBedtimes();

function refreshBedtimes() {
  bedtimeAlarmsManager.removeAll();

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
  console.log('got message ', message);
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
      sendResponse(new Error("invalid message "+message+" sender: ",sender));
      break;
  }
  return true;
});
