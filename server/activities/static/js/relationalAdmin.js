if ($ == undefined) {
  $ = django.jQuery;
}

var GraphEditor = {
  'DEBUG': false,

  'USES_DRAWER': false,
  'USES_TYPES': false,
  'USES_SCORES': false,

  'graphNodesId': "id_graph_nodes",
  'graphEdgesId': "id_graph_edges",
  'sourcePathId': "id_source_path",
  'targetPathId': "id_target_path",
  'scoredNodesId': "id_scored_nodes",

  'sourcePath': undefined,
  'targetPath': undefined,

  'addNodeToList': function(name){
    var nodeList = document.getElementById("node-list");
    this.addElementToList(name, nodeList);
  },

  'addEdgeToList': function(name){
    var edgeList = document.getElementById("edge-list");
    this.addElementToList(name, edgeList);
  },

  'addElementToList': function(name, list){
    var item = document.createElement('li');
    var itemValue = document.createElement('span');
    itemValue.appendChild(document.createTextNode(name));
    item.appendChild(itemValue);
    item.setAttribute("class", "item");
    list.appendChild(item);
  },

  'addNode': function(){
    var json = this.getGraphNodesJSON();
    var nodeName = prompt("Enter new node name");
    data = {};
    if (this.USES_TYPES) {
      var nodeType = prompt("Enter new node type");
      data["type"] = nodeType;
    }
    if (this.USES_SCORES) {
      data["score"] = 0;
    }
    json[nodeName] = data;
    this.setGraphNodesJSON(json);
    if (this.USES_DRAWER) {
      this.drawer.addNode(nodeName);
    }
  },

  'deleteNode': function(name){
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

  'addEdge': function(){
    var edgeSource = prompt("Enter source node");
    if (!this.nodeExists(edgeSource)){
      alert("ERROR: Unknown node: " + edgeSource);
      return;
    }
    var edgeTarget = prompt("Enter target node");
    if (!this.nodeExists(edgeTarget)){
      alert("ERROR: Unknown node: " + edgeTarget);
      return;
    }
    var edgeType = prompt("Enter relationship type");
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

  'deleteEdge': function(number){
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

  'nodeExists': function(nodeName){
    var nodesJSON = this.getGraphNodesJSON();
    return nodesJSON.hasOwnProperty(nodeName);
  },

  'nodeBelongsToEdge': function(name){
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      if (edges[i].source==name || edges[i].target==name)
        return true;
    }
    return false;
  },

  'getGraphNodesJSON': function(){
    return JSON.parse((document.getElementById(this.graphNodesId)).value);
  },

  'getGraphEdgesJSON': function(){
    return JSON.parse((document.getElementById(this.graphEdgesId)).value);
  },

  'setGraphNodesJSON': function(json){
    document.getElementById(this.graphNodesId).value = JSON.stringify(json);
    this.refresh();
  },

  'setGraphEdgesJSON': function(json){
    document.getElementById(this.graphEdgesId).value = JSON.stringify(json);
    this.refresh();
  },

  'clearLists': function(){
    var items = django.jQuery(".item");
    for(var i=0;i<items.length;i++){
      items[i].parentNode.removeChild(items[i]);
    }
  },

  'setStart': function(){
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

  'setFinish': function(){
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

  'setScore': function(){
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

  'refresh': function(){
    //Clear everything
    this.clearLists();
    //Set nodes
    var nodes = this.getGraphNodesJSON();
    for(var i in nodes){
      console.log(i);
      this.addNodeToList(i);
      if (nodes[i].hasOwnProperty('start')){
        document.getElementById('_start_node').value = i;
        this.sourcePath = i;
      }
      if (nodes[i].hasOwnProperty('end')){
        document.getElementById('_end_node').value = i;
        this.targetPath = i;
      }
    }
    //Set edges
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      var edgeText = edges[i].source + " -> " + edges[i].target + " (" + edges[i].type + ")";
      this.addEdgeToList(edgeText);
    }
  },

  'init': function(){
    var widgetsToHide = ['id_graph_nodes', 'id_graph_edges'];
    for(var i=0;i<widgetsToHide.length;i++){
      widget = document.getElementById(widgetsToHide[i]);
      if (!this.DEBUG) widget.style.display = "none";
    }
    var widgetsToDisable = ["id_source_path", "id_target_path"];
    for(var i=0;i<widgetsToDisable.length;i++){
      widget = document.getElementById(widgetsToDisable[i]);
      //widget.disabled = true;
    }
    var editorWidget = ' \
      <div id="graph-editor" class="form-row"> \
      <a class="addlink graph-editor" onclick="GraphEditor.addNode()">Add node</a> \
      <a class="deletelink graph-editor" onclick="GraphEditor.deleteNode()">Delete node</a> \
      <a class="addlink graph-editor" onclick="GraphEditor.addEdge()">Add edge</a> \
      <a class="deletelink graph-editor" onclick="GraphEditor.deleteEdge()">Delete edge</a> \
      <a class="changelink graph-editor" onclick="GraphEditor.setStart()">Set start node</a> \
      <input id="_start_node" type="text" disabled="true" size="5">  \
      <a class="changelink graph-editor" onclick="GraphEditor.setFinish()">Set finish node</a> \
      <input id="_end_node" type="text" disabled="true" size="5"> \
      <a class="changelink graph-editor" onclick="GraphEditor.setScore()">Set node score</a> \
      <br/> \
      <canvas id="graphcanvas"></canvas>  \
      <table><tr><td> \
      <h4>Nodes</h4> \
      <ul id="node-list"></ul> \
      </td><td> \
      <h4>Edges</h4> \
      <ol id="edge-list"></ol> \
      </td><td> \
      </td></tr></table> \
      </div>';
    django.jQuery('.graph_nodes').hide().after(editorWidget);;
    django.jQuery('.graph_edges').hide();
    django.jQuery('.constraints').hide();
    
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
  
  'drawInitialData': function(){
    for(var i in this.getGraphNodesJSON()){
      this.drawer.addNode(i);
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

