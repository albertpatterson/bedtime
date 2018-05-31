let storage = {
    get: function(keys){

        let arrayKeys = keys instanceof Array;
        if(!arrayKeys) keys = [keys];
        return new Promise(r=>chrome.storage.sync.get(keys, result=>{
            let out = arrayKeys ? result : result[keys[0]];
            r(out);
        }));
    },
    set: function(keyValPair){
        return new Promise(r=>chrome.storage.sync.set(keyValPair, r));
    },
    remove: function(keys){
        return new Promise(r=>chrome.storage.sync.remove(keys, r));
    }
};

module.exports=storage;
