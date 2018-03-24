const tab = require("./utils/tab");

chrome.browserAction.onClicked.addListener(function(){
    
    tab.sendMessage('testing')
    .then(function(){
            alert('tested');
        })
})