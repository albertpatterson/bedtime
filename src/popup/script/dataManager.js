(function(){

    const idsResource = app.constants.get("bedtimeIdsResource");
    const dataResource = app.constants.get("bedtimeDataResource");

    function getIds(){
        return app.runtime.sendMessage(new app.Message(idsResource));
    }

    function get(id){
        return app.runtime.sendMessage(new app.Message(dataResource, id, 'get'));
    }

    function set(id, value){
        return app.runtime.sendMessage(new app.Message(dataResource, id, 'set', value));
    }

    function add(){
        return app.runtime.sendMessage(new app.Message(dataResource, null, 'add'));
    }

    function remove(id){
        return app.runtime.sendMessage(new app.Message(dataResource, id, 'remove'));
    }

    app.dataManager = {
        getIds: getIds,
        get: get,
        set: set,
        add: add,
        remove: remove
    };

})()