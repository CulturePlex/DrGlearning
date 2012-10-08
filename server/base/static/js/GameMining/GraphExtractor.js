/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:2, maxerr:50 noempty:false
*/

/*global
    jQuery $ GraphEditor
*/


/*if (typeof($) === "undefined") {
  $ = django.jQuery;
}*/
var GraphExtractor = {
  //Freebase Extractor Variables:
  name: "",
  type: "",
  jsonData : "",
  search: function () {
    name = $('#query')[0].value;
    jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query= [{"name":"' + name + '","type":[]}]', function (data) {
      GraphExtractor.showTypes(data.result);
    });
  },
  get: function () {
    console.log($('#type_select_from').val());
    type = $('#type_select_from').val();
    jQuery.get("https://www.googleapis.com/freebase/v1/mqlread", 'query=[{"name":"' + name + '","type":"' + type +'","*":null}]', function (data) {
      GraphExtractor.jsonData = data;
      GraphExtractor.setGraph(data.result);
    });
  },
  init: function () {
    GraphEditor.progressBar.show();
    // Clean previous information to have a clean graph
    GraphEditor.setGraphNodesJSON({});
    GraphEditor.setGraphEdgesJSON([]);
    GraphEditor.setConstraints([]);
  },
  showTypes: function (result) {
    $('#type_select_from').empty();
    $.each(result, function (k, v) {
      if (v.type instanceof Array)
      {
        for (var obj in v.type)
        {
          $("#type_select_from").append('<option value=' + v.type[obj] + '>' + v.type[obj] + '</option>');
        }
      }
    });
  },
  setGraph: function (result) {

    GraphEditor.addNode(result.name, {type: "Banda", score: 0}, "FREEBASEGRAPH");
    $.each(result, function (k, v) {

      if (k !== "name")
      {
        if (v instanceof Array)
        {

          for (var obj in v)
          {
            GraphEditor.addNode(v[obj], {type:k, score: 0});
          }
        } else
        {
          if (v != null)
          {
            GraphEditor.addNode(v, {type: k, score: 0}, "FREEBASEGRAPH");
          }
        }
        
      }
      
    });

    $.each(result, function (k, v) {

      if (v instanceof Array)
      {
        for (var obj in v)
        {
          GraphEditor.addEdge(result.name, k, v[obj], {inverse: "inverse of" + k});
        }
      } else
      {
        if (v != null && k != null)
        {
          GraphEditor.addEdge(result.name, k, v, {inverse: "inverse of" + k});
        }
      }
    });
    //When you call this function nodes and edges list is shown 
    
    //GraphEditor.progressBar.hide();
    
  }
};

