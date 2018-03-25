const bodyClasses = document.body.classList;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message==='toggle'){
        bodyClasses.toggle("bedtime")
    }
})