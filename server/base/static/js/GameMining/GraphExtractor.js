    /*if (typeof($) === "undefined") {
  $ = django.jQuery;
}*/
var GraphExtractor = {
  //Freebase Extractor Variables:
  jsonData : "",
  get: function(name){
    jQuery.get( "https://www.googleapis.com/freebase/v1/mqlread",'query={"name":"'+ $('#query')[0].value+'","type":"/music/artist","*":null}' , function(data) {
    GraphExtractor.jsonData = data;
    GraphExtractor.setGraph(data.result);
  });
  },
  setGraph: function(result){
    GraphEditor.progressBar.show();
    // Clean previous information to have a clean graph
    GraphEditor.setGraphNodesJSON({});
    GraphEditor.setGraphEdgesJSON([]);
    GraphEditor.setConstraints([]);
    GraphEditor.addNode(result.name,{type:"Banda",score:0},"FREEBASEGRAPH");
    $.each(result, function(k,v){

      if(k != "name" && k != "type")
      {
        if(v instanceof Array)
        {

          for(obj in v)
          {
            console.log(v[obj]);
            GraphEditor.addNode(v[obj],{type:k,score:0});
          }
        }else
        {
        console.log('caca')
          GraphEditor.addNode(v,{type:k ,score:0},"FREEBASEGRAPH");
        }
        
      }
      
    });

    $.each(result, function(k,v){

      if(v instanceof Array)
      {
        for(obj in v)
        {
          GraphEditor.addEdge(result.name, k, v[obj], {inverse: "inverse of" + k});
        }
      }
    });
    GraphEditor.progressBar.hide();
    
  }
}

