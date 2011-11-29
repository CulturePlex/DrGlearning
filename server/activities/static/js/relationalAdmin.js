var GraphEditor = {
  'DEBUG': false,

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

  'addScoreToList': function(name){
    var scoreList = document.getElementById("score-list");
    this.addElementToList(name, scoreList);
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
    var nodeName = prompt("Enter new node name");
    var json = this.getGraphNodesJSON();
    json[nodeName] = {};
    this.setGraphNodesJSON(json);
    this.setGraphScoresJSON(nodeName, 0);
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
      if (i!=edgeNumber) newList.push(json[i]);
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

  'getGraphScoresJSON': function(){
    return JSON.parse((document.getElementById(this.scoredNodesId)).value);
  },

  'setGraphNodesJSON': function(json){
    document.getElementById(this.graphNodesId).value = JSON.stringify(json);
    this.refresh();
  },

  'setGraphEdgesJSON': function(json){
    document.getElementById(this.graphEdgesId).value = JSON.stringify(json);
    this.refresh();
  },

  'setGraphScoresJSON': function(name, score){
    var json = JSON.parse(document.getElementById(this.scoredNodesId).value);
    json[name] = parseFloat(score);
    document.getElementById(this.scoredNodesId).value = JSON.stringify(json);
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
    document.getElementById(this.sourcePathId).value = nodeName;
    document.getElementById("_start_node").value = nodeName;
    this.sourcePath = nodeName;
  },

  'setFinish': function(){
    var nodeName = prompt("Insert finish node");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    document.getElementById(this.targetPathId).value = nodeName;
    document.getElementById("_end_node").value = nodeName;
    this.targetPath = nodeName;
  },

  'setScore': function(){
    var nodeName = prompt("Enter node to be modified");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    var score = prompt("Enter new score")
    this.setGraphScoresJSON(nodeName, score);
  },

  'refresh': function(){
    //Clear everything
    this.clearLists();
    this.sourcePath = document.getElementById(this.sourcePathId).value;
    this.targetPath = document.getElementById(this.targetPathId).value;
    document.getElementById('_start_node').value = this.sourcePath;
    document.getElementById('_end_node').value = this.targetPath;
    //Set nodes
    var nodes = this.getGraphNodesJSON();
    for(var i in nodes){
      this.addNodeToList(i);
    }
    //Set edges
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      var edgeText = edges[i].source + " -> " + edges[i].target + " (" + edges[i].type + ")";
      this.addEdgeToList(edgeText);
    }
    var scores = this.getGraphScoresJSON();
    for(var score in scores){
      this.addScoreToList(score + ": " + scores[score]);
    }
  },

  'init': function(){
    var widgetsToHide = ['id_graph_nodes', 'id_graph_edges', 'id_scored_nodes'];
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
      <h4>Scores</h4> \
      <ul id="score-list"></ul> \
      </td></tr></table> \
      </div>';
    django.jQuery('.graph_nodes').hide();
    django.jQuery('.graph_edges').hide();
    django.jQuery('.source_path').hide();
    django.jQuery('.target_path').hide();
    django.jQuery('.constraints').hide();
    django.jQuery('.scored_nodes').hide().after(editorWidget);
  }

}

window.onload = function(){
  GraphEditor.init();
  GraphEditor.refresh();
  Processing.loadSketchFromSources(document.getElementById('graphcanvas'), ['/static/js/graphdrawer.pde']);
}

