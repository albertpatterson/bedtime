(function(){

  console.log(app)

  document.getElementById("add-bedtime").onclick=app.controller.add
  app.controller.init();
  
})();