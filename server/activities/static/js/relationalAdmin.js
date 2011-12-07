if ($ == undefined) {
  $ = django.jQuery;
}


var GraphEditor = {
  DEBUG: true,

  USES_DRAWER: false,
  USES_TYPES: false,
  USES_SCORES: false,

  graphNodesId: "id_graph_nodes",
  graphEdgesId: "id_graph_edges",
  sourcePathId: "id_source_path",
  targetPathId: "id_target_path",
  scoredNodesId: "id_scored_nodes",
  constraintsId: "id_constraints",

  sourcePath: undefined,
  targetPath: undefined,

  addNodeToList: function(name){
    var nodeList = document.getElementById("node-list");
    this.addElementToList(name, nodeList);
  },

  addEdgeToList: function(name){
    var edgeList = document.getElementById("edge-list");
    this.addElementToList(name, edgeList);
  },

  addElementToList: function(name, list){
    var item = document.createElement('li');
    var itemValue = document.createElement('span');
    itemValue.appendChild(document.createTextNode(name));
    item.appendChild(itemValue);
    item.setAttribute("class", "item");
    list.appendChild(item);
  },

  addNode: function(_name, _properties){
    // Only prompts if the parameter is not sent
    var nodeName = typeof(_name) != 'undefined' ? _name : prompt("Enter new node name");
    
    var json = this.getGraphNodesJSON();
    if (this.nodeExists(nodeName)){
      alert("ERROR: That node already exists")
      return;
    }
    var data = typeof(_properties) != 'undefined' ? _properties : {};
    if (this.USES_TYPES) {
      data["type"] = data.hasOwnProperty('type') ? data["type"] : prompt("Enter new node type");
    }
    if (this.USES_SCORES) {
      data["score"] = data.hasOwnProperty('score') ? data["score"] : 0;
    }
    json[nodeName] = data;
    this.setGraphNodesJSON(json);
    if (this.USES_DRAWER) {
      if (data.hasOwnProperty('position')){
        this.drawer.addLocatedNode(nodeName, _properties['position']['x'], _properties['position']['y'])
      } else {
        this.drawer.addNode(nodeName);
      }
    }
  },

  deleteNode: function(name){
    var nodeName = prompt("Enter node to be deleted");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    if (this.nodeBelongsToEdge(nodeName)){
      alert("ERROR: node " + nodeName + " belongs to a relationship. Delete relationship first");
      return;
    }
    if (nodeName == this.sourcePath || nodeName == this.targetPath){
        alert("ERROR: node " + nodeName + " is either start or finish node");
      return;
    }
    var json = this.getGraphNodesJSON();
    delete json[nodeName];
    this.setGraphNodesJSON(json);
    if (this.USES_DRAWER) {
      this.drawer.deleteNode(nodeName);
    }
  },

  addEdge: function(_source, _type, _target){
    // Only prompts if the parameter is not sent
    var edgeSource = typeof(_source) != 'undefined' ? _source : prompt("Enter source node");
    var edgeType = typeof(_type) != 'undefined' ? _type: prompt("Enter relationship type");
    var edgeTarget = typeof(_target) != 'undefined' ? _target: prompt("Enter target node");
    
    if (!this.nodeExists(edgeSource)){
      alert("ERROR: Unknown node: " + edgeSource);
      return;
    }
    if (!this.nodeExists(edgeTarget)){
      alert("ERROR: Unknown node: " + edgeTarget);
      return;
    }
    if (edgeType == "") {
      alert("Relationship type is mandatory");
      return;
    }
    var json = this.getGraphEdgesJSON();
    var newEdge = {"source": edgeSource, "target": edgeTarget, "type": edgeType};
    json.push(newEdge);
    this.setGraphEdgesJSON(json);
    if (this.USES_DRAWER) {
      this.drawer.addEdge(edgeSource, edgeType, edgeTarget);
    }
  },

  deleteEdge: function(number){
    var edgeNumber= parseInt(prompt("Enter edge number to be deleted")) - 1;
    var json = this.getGraphEdgesJSON();
    if (edgeNumber>json.length || edgeNumber<0) {
      alert("Invalid edge number: " + (edgeNumber+1));
      return;
    }
    var newList = []
    for(var i=0;i<json.length;i++) {
      if (i!=edgeNumber) {
        newList.push(json[i]);
      } else {
        if (this.USES_DRAWER) {
          this.drawer.deleteEdge(json[i]["source"],
                                      json[i]["type"],
                                      json[i]["target"]);
        }
      }
    }
    this.setGraphEdgesJSON(newList);
  },

  nodeExists: function(nodeName){
    var nodesJSON = this.getGraphNodesJSON();
    return nodesJSON.hasOwnProperty(nodeName);
  },

  nodeBelongsToEdge: function(name){
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      if (edges[i].source==name || edges[i].target==name)
        return true;
    }
    return false;
  },

  getGraphNodesJSON: function(){
    return JSON.parse((document.getElementById(this.graphNodesId)).value);
  },

  getGraphEdgesJSON: function(){
    return JSON.parse((document.getElementById(this.graphEdgesId)).value);
  },

  getConstraints: function(){
    return JSON.parse($('#'+this.constraintsId).val());
  },

  setGraphNodesJSON: function(json){
    document.getElementById(this.graphNodesId).value = JSON.stringify(json);
    this.refresh();
  },

  setGraphEdgesJSON: function(json){
    document.getElementById(this.graphEdgesId).value = JSON.stringify(json);
    this.refresh();
  },

  setConstraints: function(json){
    $('#'+this.constraintsId).val(JSON.stringify(json));
  },

  clearLists: function(){
    var items = django.jQuery(".item");
    for(var i=0;i<items.length;i++){
      items[i].parentNode.removeChild(items[i]);
    }
  },

  setStart: function(){
    var nodeName = prompt("Insert start node");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    document.getElementById("_start_node").value = nodeName;
    json = this.getGraphNodesJSON();
    delete json[this.sourcePath]["start"];
    this.sourcePath = nodeName;
    json[nodeName]["start"] = true;
    this.setGraphNodesJSON(json);
  },

  setFinish: function(){
    var nodeName = prompt("Insert finish node");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    document.getElementById("_end_node").value = nodeName;
    json = this.getGraphNodesJSON();
    delete json[this.targetPath]["end"];
    this.targetPath = nodeName;
    json[nodeName]["end"] = true;
    this.setGraphNodesJSON(json);
  },

  setScore: function(){
    var nodeName = prompt("Enter node to be modified");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    var score = prompt("Enter new score")
    json = this.getGraphNodesJSON();
    json[nodeName]["score"] = score;
    this.setGraphNodesJSON(json);
  },

  loadGEXF: function(){
        function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object
    
        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
    
          var reader = new FileReader();
    
          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              var gexfContent = e.target.result;
              // GEXF IMPORTATION FUNCTION
              $(gexfContent).find('node').each(function(){
                GraphEditor.addNode($(this).attr('label'), {
                                    "score": 0,
                                    "type": $(this).find('attvalue').attr('value'),
                                    "position": {
                                      "x":$(this).find('viz\\:position').attr('x'),
                                      "y":$(this).find('viz\\:position').attr('y')
                                    }
                });
              });
              $(gexfContent).find('edge').each(function(){
                var sourceId = $(this).attr('source');
                var targetId = $(this).attr('target');
                var source = $(gexfContent).find('node#'+sourceId).attr('label');
                var target = $(gexfContent).find('node#'+targetId).attr('label');
                var type = $(this).attr('label');
                GraphEditor.addEdge(source, type, target);
              });
            };
          })(f);
    
          // Read in the image file as a data URL.
          reader.readAsText(f);
        }
      }
    document.getElementById('files').addEventListener('change', handleFileSelect, false);
  },
  
  refresh: function(){
    //Clear everything
    this.clearLists();
    //Set nodes
    var nodes = this.getGraphNodesJSON();
    var nodeTypes = {};
    for(var i in nodes){
      this.addNodeToList(i);
      if (nodes[i].hasOwnProperty('start')){
        document.getElementById('_start_node').value = i;
        this.sourcePath = i;
      }
      if (nodes[i].hasOwnProperty('end')){
        document.getElementById('_end_node').value = i;
        this.targetPath = i;
      }
      nodeTypes[nodes[i]["type"]] = {};
    }
    //Set edges
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      var edgeText = edges[i].source + " -> " + edges[i].target + " (" + edges[i].type + ")";
      this.addEdgeToList(edgeText);
    }
    //Set constraints
    var constraints = this.getConstraints();
    for(var i=0;i<constraints.length;i++){
      $('#constraint-list').append('<li>'+JSON.stringify(constraints[i])+'</li>');
    }
    for(var nodeType in nodeTypes){
      $('#constraint-types').append('<option value="'+ nodeType+ '">'+nodeType+'</option>');
    }
  },

  init: function(){

    var editorWidget = '<div id="graph-editor" class="form-row">' +
        '<a class="addlink graph-editor" onclick="GraphEditor.addNode()">Add node</a>' +
        '<a class="deletelink graph-editor" onclick="GraphEditor.deleteNode()">Delete node</a>' +
        '<a class="addlink graph-editor" onclick="GraphEditor.addEdge()">Add edge</a>' +
        '<a class="deletelink graph-editor" onclick="GraphEditor.deleteEdge()">Delete edge</a>' +
        '<a class="changelink graph-editor" onclick="GraphEditor.setScore()">Set node score</a>' +
        '<br/>' +
        '<canvas id="graphcanvas"></canvas>' +
        '<div class="controlpanel">' +
          '<label for="gexf-file">Import GEXF</label>' +
          '<input type="file" id="files" name="files[]" multiple />' +
        '</div>' +
        '<table><tr><td>' +
          '<h4>Nodes</h4>' +
          '<ul id="node-list"></ul>' +
          '</td><td>' +
          '<h4>Edges</h4>' +
          '<ol id="edge-list"></ol>' +
          '</td><td>' +
        '</td></tr></table>' +
      '</div>';
    if (!this.DEBUG){
      $('.graph_nodes').hide();
      $('.graph_edges').hide();
      $('.constraints').hide();  
    }
    $('.constraints').before(editorWidget);
   
    this.loadGEXF();

    var activityWidget = '<div id="activityWidget">' +
        '<h3>Start node</h3>' +
        '<a class="changelink graph-editor" onclick="GraphEditor.setStart()">Set start node</a>' +
        '<input id="_start_node" type="text" disabled="true" size="5">' +
        '<hr/>' +
        '<div id="constraints">' +
        '<h3>Constraints</h3>' +
        '<ol id="constraint-list"></ol>' +
        '<select id="constraint-types"></select>' +
        '<select id="constraint-operator">' +
        '<option value="lt">&lt;</option>' +
        '<option value="let">&lt;&#61</option>' +
        '<option value="gt">&gt;</option>' +
        '<option value="get">&gt;&#61</option>' +
        '<option value="eq">&#61;</option>' +
        '<option value="neq">&#33;&#61;</option>' +
        '</select>' +
        '<input type="text" id="constraint-value" size="3"/>' +
        '<button type="button" id="add-constraint">Add constraint</button>' +
        '</div>' +
        '<hr/>' +
        '<h3>Finish node</h3>' +
        '<a class="changelink graph-editor" onclick="GraphEditor.setFinish()">Set finish node</a>' +
        '<input id="_end_node" type="text" disabled="true" size="5">' +
        '</div>';

    $('.controlpanel').before(activityWidget);
    $('#add-constraint').click(function(){
      var newConstraint = {
        type: $('#constraint-types').val(),
        operator: $('#constraint-operator').val(),
        value: $('#constraint-value').val()
      };
      var constraints = GraphEditor.getConstraints();
      constraints.push(newConstraint);
      GraphEditor.setConstraints(constraints);
      $('#constraint-list').append('<li>' + JSON.stringify(newConstraint) + '</li>');
    });
    
    // Black magic to have the Processing drawer ready to call the drawInitialData method
    // The ajax petition is a straightforward copy from the Processing original code in
    // its init method
    if (GraphEditor.USES_DRAWER){
      $.ajax({
        url: "/static/js/graphdrawer.pde",
        success: function(block, error){
          GraphEditor.drawer = new Processing(document.getElementById('graphcanvas'), block);
          GraphEditor.drawInitialData();
        },
        error: function(){console.log("error")}
        }
      );
    }
  },
  
  drawInitialData: function(){
    var nodesJSON = this.getGraphNodesJSON();
    var node;
    for(var i in nodesJSON){
      node = nodesJSON[i];
      if (node.hasOwnProperty('position')){
        this.drawer.addLocatedNode(i, node['position']['x'], node['position']['y'])
      } else {
        this.drawer.addNode(i);
      }
    }
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      var edge = edges[i];
      this.drawer.addEdge(edge["source"], edge["type"], edge["target"]);
    }
  }
}

$(document).ready(function(){
  GraphEditor.USES_DRAWER = true;
  GraphEditor.USES_TYPES = true;
  GraphEditor.USES_SCORES = true;
  GraphEditor.init();
  GraphEditor.refresh();
});

