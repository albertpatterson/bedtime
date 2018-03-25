const tab = require("./utils/tab");

chrome.browserAction.onClicked.addListener(function(){
    tab.sendMessage('toggle')
})