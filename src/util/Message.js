(function(){

    let Message = function(resource,  id, action, value){
        this.resource = resource;
        this.id = id;
        this.action = action;
        this.value = value;
    }

    if(typeof app === "undefined"){
        module.exports = Message;
    }else{
        app.Message = Message;
    }
})()