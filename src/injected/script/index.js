const runtime = require("../../util/runtime");

queryBedtime();

const bodyClasses = document.body.classList;

addBedtimeMessage();

runtime.addListener(function(message, sender, sendResponse){
    console.log(message);
    if(message==='begin-bedtime'){
        bodyClasses.add("bedtime")
    }else if(message==='end-bedtime'){
        bodyClasses.remove("bedtime")
    }else if(message==='begin-bedtime-warning'){
        queryBedtime()
    }
    sendResponse()
});

function queryBedtime(){
    chrome.runtime.sendMessage('query-bedtime', function(bedtime){
        if(bedtime.state==="bedtime-warning"){
            alert('Bedtime is at ' + bedtime.time);
        }else if(bedtime.state==="bedtime"){
            bodyClasses.add("bedtime")
        }
    })
}

function snooze(){
  bodyClasses.remove("bedtime");
  setTimeout(queryBedtime, 5*60e3);
}

function addBedtimeMessage(){

    const wrapper = document.createElement("div");
    wrapper.style.background = "white";
    wrapper.style.textAlign = "middle";
    wrapper.id = "bedtime-notice";


    const message = document.createElement('p');
    message.style.fontSize = "30px";
    message.style.textAlign="center";
    message.innerText="It's bedtime.";
    message.id = "bedtime-message";
    wrapper.appendChild(message);

    let snoozeButton = document.createElement("button");
    snoozeButton.innerText="Snooze";
    snoozeButton.onclick = snooze;
    snoozeButton.id ="snooze-button";
    wrapper.appendChild(snoozeButton);

    document.body.appendChild(wrapper);
}