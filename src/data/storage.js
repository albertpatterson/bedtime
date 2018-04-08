(function(){

    let storage = {
        get: function(keys){
            if(!(keys instanceof Array)) keys = [keys];
            return new Promise(r=>chrome.storage.sync.get(keys, r));
        },
        set: function(keyValPair){
            return new Promise(r=>chrome.storage.sync.set(keyValPair, r));
        }
    }

    if(typeof app === "undefined"){
        module.exports=storage;
        console.log("app undefined");
    }else{
        app.storage=storage;        
    }
})()