const runtime = require("../../util/runtime");

queryBedtime();

const bodyClasses = document.body.classList;

addBedtimeMessage()

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
})

function queryBedtime(){
    chrome.runtime.sendMessage('query-bedtime', function(bedtime){
        console.log('args', arguments)
        console.log("onload bedtime state is "+bedtime.state);
        if(bedtime.state==="bedtime-warning"){
            alert('Bedtime is at ' + bedtime.time);
        }else if(bedtime.state==="bedtime"){
            bodyClasses.add("bedtime")
        }
    })
}

function addBedtimeMessage(){
    let m = document.createElement('p');
    m.id = "bedtime-notice";
    m.style.fontSize = "30px";
    m.style.textAlign="center";
    m.innerText="It's bedtime."
    document.body.appendChild(m)
}