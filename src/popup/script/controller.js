(function(){

    app.ids = [];
    app.viewManager = null;

    function updateData(id, data){
        return app.dataManager.set(id, data);        
    }

    function removeData(id){
        return app.dataManager.remove(id)
        .then(app.ids.splice(app.ids.indexOf(id), 1));
    }

    function addBedtime(){
        return app.dataManager.add()
        .then(id=>{
            app.ids.push(id);
            addView(null, id);
        })
    }

    function addView(data, id){
        app.viewManager.add(data, data=>updateData(id, data), ()=>removeData(id));
    }

    function initBedtimes(ids){
        app.viewManager = new app.ViewManager(addBedtime);
        app.ids = ids || [];
        let viewsReady = app.ids.map(id=>{
            return app.dataManager.get(id)
            .then(data=>addView(data, id))
        });
        return Promise.all(viewsReady);
    } 

    app.controller = {
        init: function(){
            app.dataManager.getIds()
            .then(initBedtimes);
        },
        add: addBedtime
    }
})()