function _getTabs(queryInfo){
    queryInfo = queryInfo || {  active: true,
                                currentWindow: true};

    return new Promise(res=>chrome.tabs.query(queryInfo, res))
}

function sendMessage(content, queryInfo){
    return  _getTabs(queryInfo)
            .then(tabs=>Promise.all(tabs.map(tab=>sendToTab(tab, content))));
}

function sendToTab(tab, content){
    let d=new Date();
    let hour=d.getHours(), min=d.getMinutes(), t=hour+":"+min;
    console.log("sent ", content," to ", tab.id, " at "+t);
    return new Promise(res=>chrome.tabs.sendMessage(tab.id, content, res))
}

module.exports = {
    sendMessage
} 