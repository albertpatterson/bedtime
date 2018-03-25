(function(){

    let bedtime = "23:00";
    let active = {
        sunday: true, 
        monday: true, 
        tuesday: true, 
        wednesday: true, 
        thursday: true, 
        friday: false,
        saturday: false};
    
    const inputs = {
        bedtime: document.getElementById("bedtime"),
        sunday: document.getElementById("sunday"),
        monday: document.getElementById("monday"),
        tuesday: document.getElementById("tuesday"),
        wednesday: document.getElementById("wednesday"),
        thursday: document.getElementById("thursday"),
        friday: document.getElementById("friday"),
        saturday: document.getElementById("saturday"),
        submit: document.getElementById("bedtime-submit")
    };
    
    inputs.bedtime.value=bedtime;
    for(day in active){
        inputs[day].checked=active[day];
    }

    inputs.submit.onclick = submitBedtime

    function submitBedtime(){
        bedtime = inputs.bedtime.value;
        let activeDays = [];
        for(day in active){
            active[day] = inputs[day].checked;
            if(active[day]) activeDays.push(day);
        }

        console.log(`bedtime is ${bedtime} on: ${activeDays}`)
    }
})()