function sendMessage(message, sendResponse){
    sendResponse = sendResponse || function(){};
    chrome.runtime.sendMessage(message, sendResponse)
}


function addListener(callback){
    chrome.runtime.onMessage.addListener(callback);
}

module.exports = {
    sendMessage: sendMessage,
    addListener: addListener
};