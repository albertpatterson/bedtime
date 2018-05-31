const storage = require("./storage");

function GetterSetter(name){
    this.get = function(nameArg){
        return storage.get(nameArg || name);
    };
    this.set = function(arg1, arg2){
        if(arguments.length===1){
            nameIn = name;
            value = arg1;
        }else if(arguments.length===2){
            nameIn = arg1;
            value = arg2;
        }else{
            throw new Error("invalid inputs")
        }
        let data={};
        data[nameIn]=value;
        return storage.set(data);
    }
}

let count = new GetterSetter('bedtime-count');
let ids = new GetterSetter('bedtime-ids');

let bedtime = new GetterSetter();
bedtime.add = function(){
    const countProm =  count.get();
    return countProm.then(curCount=>{
        let newCount=typeof(curCount)==="undefined" ? 0 : (curCount+1);
        let id = getId(newCount);
        console.log('generated id ', id);
        return count.set(newCount).then(()=>id);
    })
};

bedtime._doSet = bedtime.set;
bedtime.set = function(id, value){
    let idsProm = ids.get();
    return idsProm
    .then(ids => ids&&ids.indexOf(id)!==-1 ? Promise.resolve() : addId(id))
    .then(() => bedtime._doSet(id, value))
};

bedtime.remove = function(id){
    return storage.remove(id)
    .then(() => {
        return ids.get();
    })
    .then(btIds=>{
        btIds.splice(btIds.indexOf(id), 1);
        bedtimeIds = btIds;
        return ids.set(bedtimeIds)
    })
};

function addId(id){
    // bedtimeIds = bedtimeIds || [];
    return ids.get()
    .then(idVals=>{
        idVals = idVals || [];
        if(idVals.indexOf(id)!==-1){
            throw new Error("attempted to add existing id ", id);
        }else{
            idVals.push(id);
        }
        return ids.set(idVals);
    })
}

function getId(count){
    return 'bedtime-data-'+count;
}

let bedtimeDataManager = {
    ids: ids,
    bedtime: bedtime
};

module.exports = bedtimeDataManager;

