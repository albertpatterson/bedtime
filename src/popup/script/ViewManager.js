(function(){

    app.ViewManager = class{
        constructor(addData){
            this._addData = addData;
        }
        add(data, updateData, removeData){
            new app.BedtimeView(data, updateData, removeData);
        }
    }
})()