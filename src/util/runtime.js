(function(){
    function sendMessage(message){
        console.log("sending ", message)
        return new Promise(r=>chrome.runtime.sendMessage(message, r))
    }

    function addListener(fcn){
        chrome.runtime.onMessage.addListener(fcn);
    }

    function removeListener(fcn){
        chrome.runtime.onMessage.removeListener(fcn);
    }

    let runtime = {
        sendMessage: sendMessage,
        addListener: addListener,
        removeListener: removeListener
    };

    if(typeof app === "undefined"){
        module.exports = runtime;
    }else{
        app.runtime = runtime;
    }

})()