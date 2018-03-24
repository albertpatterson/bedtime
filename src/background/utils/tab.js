function _getTabs(queryInfo){
    queryInfo = queryInfo || {  active: true,
                                currentWindow: true};

    return new Promise(res=>chrome.tabs.query(queryInfo, res))
}

function sendMessage(content, queryInfo){
    return  _getTabs(queryInfo)
            .then(tabs=>new Promise(res=>chrome.tabs.sendMessage(tabs[0].id, content, res)));
}

module.exports = {
    sendMessage
} 