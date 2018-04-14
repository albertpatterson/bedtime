(function(){
    // function sendMessage(message){
    //     console.log("sending ", message)
    //     return new Promise(r=>chrome.runtime.sendMessage(message, r))
    // }

    function sendMessage(message){
        console.log('sending message ', message);
        return new Promise(r=>chrome.runtime.sendMessage(message, 
            // function(){
            //     let send = [].slice.call(arguments);
            //     console.log('send ', send);
            //     r(send);
            // }
            r
        ))
        .then(rs=>{console.log('got response ', rs, Date.now()); return rs;})
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