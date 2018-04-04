app = {};
app.Bedtime = (function(){

  var bedtimeCount = 0;

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const bedtimeViewCont = document.getElementById("bedtimeViewCont");

  function addView(id){
    // let view = document.createDocumentFragment();
    let view = document.createElement('div');
    view.id = getID(id, "cont");
    view.appendChild(createTimeAndDayView(id));
    view.appendChild(createDeleteView(id));
    bedtimeViewCont.appendChild(view);
  }

  function createTimeAndDayView(id){
    // let view = document.createDocumentFragment();
    let view = document.createElement('div');
    view.className = "time-and-day";
    view.appendChild(createTimeView(id));
    view.appendChild(createDaysView(id));
    return view
  }
  function createTimeView(id){
    let cont = document.createElement('div');
    cont.className = "select-cont";

    let timeId = getID(id, "time");

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
    input.onchange = ()=>updateData(id);

    return cont;
  }

  function createDaysView(id){
    // let view = document.createDocumentFragment();
    let cont = document.createElement('div');
    cont.className="days-select";
    cont.id=getID(id, days);
    days.forEach(day => cont.appendChild(createDayView(id, day)));
    return cont;
  }

  function createDayView(id, day){

    let boxId = id+day;

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
    checkbox.onchange = ()=>updateData(id);

    return cont;
  }

  function createDeleteView(id){
    let cont = document.createElement('div');
    cont.className='delete-cont';

    let button = document.createElement('button');
    cont.appendChild(button);
    button.className='delete-button';
    button.innerText = 'x';

    button.onclick = ()=>deleteBedtimeView(id);

    return cont;
  }

  function updateBedtimeView(id){

  }

  function deleteBedtimeView(id){
    bedtimeViewCont.removeChild(document.getElementById("cont"+id))
  }

  function getID(baseId, type){
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
    }
  }

  return class Bedtime{
    constructor(bedtime){
      if(bedtime) this.setBedtime(betime);
      this._id="bedtime"+bedtimeCount++;
      addView(this._id)
    }

    setBedtime(bedtime){
      // update data

      //update view
      updateBedtimeView(this.id, bedtime)
    }

    delete(){
      // update data

      // update view
      deleteBedtimeView(this.id)
    }
  };
})();