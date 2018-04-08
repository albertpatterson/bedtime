app.BedtimeView = (function(){

  var bedtimeCount = 0;

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const bedtimeViewCont = document.getElementById("bedtimeViewCont");

  function addView(id, updateData, removeData){
    // let view = document.createDocumentFragment();
    let view = document.createElement('div');
    view.id = getId("cont", id);
    view.appendChild(createTimeAndDayView(id, updateData));
    view.appendChild(createDeleteView(id, removeData));
    bedtimeViewCont.appendChild(view);
  }

  function createTimeAndDayView(id, updateData){
    // let view = document.createDocumentFragment();
    let view = document.createElement('div');
    view.className = "time-and-day";
    view.appendChild(createTimeView(id, updateData));
    view.appendChild(createDaysView(id, updateData));
    return view
  }
  function createTimeView(id, updateData){
    let cont = document.createElement('div');
    cont.className = "select-cont";

    let timeId = getId("time", id);

    let label = document.createElement("label");
    cont.appendChild(label);
    label.for=timeId;
    label.className="bedtime-label";
    label.innerText="Bedtime";

    let input = document.createElement("input");
    cont.appendChild(input);
    input.type="time";
    input.className="time-select";
    input.id=timeId;
    input.onchange = ()=>getDataAndUpdate(id, updateData);

    return cont;
  }

  function createDaysView(id, updateData){
    // let view = document.createDocumentFragment();
    let cont = document.createElement('div');
    cont.className="days-select";
    cont.id=getId('days', id);
    days.forEach(day => cont.appendChild(createDayView(id, updateData, day)));
    return cont;
  }

  function createDayView(id, updateData, day){

    let boxId = getId('day',id,day);

    let cont = document.createElement('div');
    cont.className="day-checkbox-cont";

    let label = document.createElement("label");
    cont.appendChild(label);
    label.for=boxId;
    label.className="day-checkbox-label";
    label.innerText=day[0].toUpperCase();

    let checkbox = document.createElement('input');
    cont.appendChild(checkbox);
    checkbox.type="checkbox";
    checkbox.id=boxId;
    checkbox.className="day-checkbox";
    checkbox.onchange =  ()=>getDataAndUpdate(id, updateData);

    return cont;
  }

  function createDeleteView(id, removeData){
    let cont = document.createElement('div');
    cont.className='delete-cont';

    let button = document.createElement('button');
    cont.appendChild(button);
    button.className='delete-button';
    button.innerText = 'x';

    button.onclick = ()=>removeData().then(()=>deleteBedtimeView(id));

    return cont;
  }

  function getDataAndUpdate(id, updateData){
   
    let time = document.getElementById(getId('time',id)).value;
    if(time){
      let active = {};

      app.constants.get("days").map(day=>{
        let checked = document.getElementById(getId('day', id, day)).checked; 
        active[day]=checked;
      });
      updateData(new app.BedtimeData(time, active));
    }
  }

  function deleteBedtimeView(id){
    bedtimeViewCont.removeChild(document.getElementById("cont"+id))
  }

  function getId(type, baseId, suffix){
    switch(type) {
      case "cont":
        return "cont"+baseId;
        break;
      case "time":
        return "time"+baseId;
        break;
      case "days":
        return "days"+baseId;
        break
      case "day":
        return "day"+baseId+suffix; 
    }
  }

  return class BedtimeView{
    constructor(data, updateData, removeData){
      this._id="bedtime"+bedtimeCount++;
      this._updateData = updateData;
      this.removeData = removeData;  
      addView(this._id, updateData, removeData);
      if(data) updateData(this._id, data);
    }

    // updateData(){
    //   let data = getData(this._id);
    //   if(data) this._updateData(data);
    // }

    // delete(){
    //   this._removeData.then(()=>deleteBedtimeView(this.id));
    // }
  };
})();