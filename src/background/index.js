chrome.browserAction.onClicked.addListener(function(){
    sendMessage('testing')
    .then(function(){
            alert('tested');
        })
})

function _getTabs(queryInfo){
    queryInfo = queryInfo || {  active: true,
                                currentWindow: true};

    return new Promise(res=>chrome.tabs.query(queryInfo, res))
}

function sendMessage(content, queryInfo){
    return  _getTabs(queryInfo)
            .then(tabs=>new Promise(r=>chrome.tabs.sendMessage(tabs[0].id, content, r)));
}
