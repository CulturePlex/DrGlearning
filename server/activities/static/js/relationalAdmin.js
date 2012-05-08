if ($ == undefined) {
  $ = django.jQuery;
}


var GraphEditor = {
  DEBUG: false,

  USES_DRAWER: false,
  USES_TYPES: false,
  USES_SCORES: false,

  PDE_URL: "/js/graphdrawer.pde",

  // This parameter should be set to true with long batch
  // operations (loading from GEXF) and set to false again
  // when done. Method "refresh" should be manually called
  _stopRefreshing: false,

  graphNodesId: "id_graph_nodes",
  graphEdgesId: "id_graph_edges",
  sourcePathId: "id_source_path",
  targetPathId: "id_target_path",
  scoredNodesId: "id_scored_nodes",
  constraintsId: "id_constraints",

  CONSTRAINTS_LIMIT: 5,

  progressBar: {
    show: function() {
      GraphEditor._stopRefreshing = true;
    },
    hide: function() {
      GraphEditor._stopRefreshing = false;
      GraphEditor.refresh();
    },
    set: function(value) {$('#'+GraphEditor.progressBarId+' progress').val(value);}
  },

  sourcePath: undefined,
  targetPath: undefined,

  addNodeToList: function(name){
    var nodeList = $("#node-list");
    var node = this.getGraphNodesJSON()[name];

    // Delete button
    var deleteControl = $('<ul class="actions">')
      .append($('<li class="delete-link">')
        .append($('<a onClick="GraphEditor.deleteNode(\'' + name + '\')">').text("Delete")));
    deleteControl.append($('<li class="change-link">')
      .append($('<a onClick="GraphEditor.setScore(\'' + name + '\')">').text('Set Score')));

    if (node.type != undefined && node.score != undefined){
      name += ' (type: ' + node.type + ', score: ' + node.score + ')';
    }
    this.addElementToList(name, nodeList, deleteControl);
  },

  addEdgeToList: function(name){
    var edgeList = $("#edge-list");

    // Delete button
    var elementNumber = $('#edge-list li').size();
    var deleteControl = $('<ul class="actions">')
      .append($('<li class="delete-link">')
        .append($('<a onClick="GraphEditor.deleteEdge(' + elementNumber + ')" src="/static/grappelli/img/icons/icon-actions-delete-link.png">').text("Delete")));

    this.addElementToList(name, edgeList, deleteControl);
  },

  addElementToList: function(name, list, deleteControl){
    var item = $('<li>');
    item.text(name);
    if (deleteControl !== undefined) { item.append(deleteControl); };
    item.addClass("item");
    list.append(item);
  },

  addNode: function(_name, _properties){
    // Only prompts if the parameter is not sent
    var nodeName = _name != undefined ? _name : $('#node-name').val();
    
    var json = this.getGraphNodesJSON();
    if (this.nodeExists(nodeName)){
      alert("ERROR: That node already exists")
      return;
    }
    var data = typeof(_properties) != 'undefined' ? _properties : {};
    if (this.USES_TYPES) {
      data["type"] = data.hasOwnProperty('type') ? data["type"] : $('#node-type').val();
    }
    if (this.USES_SCORES) {
      data["score"] = data.hasOwnProperty('score') ? data["score"] : 0;
    }
    json[nodeName] = data;
    this.setGraphNodesJSON(json);
    if (this.USES_DRAWER) {
      if (data.hasOwnProperty('position')){
        this.drawer.addLocatedNode(nodeName, _properties['position']['x'], _properties['position']['y'], data.type)
      } else {
        this.drawer.addNode(nodeName, data.type);
      }
    }
  },

  deleteNode: function(name){
    var nodeName = name !== undefined ? name : prompt("Enter new node name");
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

  addEdge: function(_source, _type, _target, _properties){
    // Only prompts if the parameter is not sent
    var edgeSource = _source !== undefined ? _source : $('#source-node').val();
    var edgeType = _type !== undefined ? _type: $('#edge-type').val();
    var edgeTarget = _target !== undefined ? _target: $('#target-node').val();

    // Inverse edge type
    var edgeInverseType = $('#edge-inverse-type').val();
    
    // Taking inverse relationship property if edge comes from GEXF import
    if (edgeInverseType === undefined) {
      if (_properties.hasOwnProperty('inverse')) {
        edgeInverseType = _properties.inverse;
      } else {
        edgeInverseType = "";
      }
    }
    // Discard only-white strings
    edgeInverseType =  (edgeInverseType.search(/^\s*$/) == -1) ? edgeInverseType : "";
    
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
    var newEdge = {"source": edgeSource, "target": edgeTarget, "type": edgeType,
                  "inverse": edgeInverseType, "properties": _properties};
    json.push(newEdge);
    this.setGraphEdgesJSON(json);
    if (this.USES_DRAWER) {
      this.drawer.addEdge(edgeSource, edgeType, edgeTarget);
    }
  },

  deleteEdge: function(number){
    var edgeNumber = number !== undefined ? number : parseInt(prompt("Enter edge number to be deleted"));
    var json = this.getGraphEdgesJSON();
    if (edgeNumber>json.length || edgeNumber<0) {
      alert("Invalid edge number: " + (edgeNumber));
      return;
    }
    var newList = []
    edgeNumber--;
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
    $('#'+this.graphNodesId).val(JSON.stringify(json));
    if (!this._stopRefreshing) {
      this.refresh();
    }
  },

  setGraphEdgesJSON: function(json){
    $('#'+this.graphEdgesId).val(JSON.stringify(json));
    if (!this._stopRefreshing) {
      this.refresh();
    }
  },

  setConstraints: function(json){
    $('#'+this.constraintsId).val(JSON.stringify(json));
  },

  clearLists: function(){
    var items = django.jQuery(".item");
    for(var i=0;i<items.length;i++){
      items[i].parentNode.removeChild(items[i]);
    }
    $('#_start_node').empty();
    $('#_end_node').empty();
  },

  setStart: function(){
    var nodeName = $('#_start_node').val();
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    json = this.getGraphNodesJSON();
    if (this.sourcePath) {
      delete json[this.sourcePath]["start"];
    }
    this.sourcePath = nodeName;
    json[nodeName]["start"] = true;
    this.setGraphNodesJSON(json);
  },

  setFinish: function(){
    var nodeName = $('#_end_node').val();
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    json = this.getGraphNodesJSON();
    if (this.targetPath) {
      delete json[this.targetPath]["end"];
    }
    this.targetPath = nodeName;
    json[nodeName]["end"] = true;
    this.setGraphNodesJSON(json);
  },

  deleteConstraint: function(constraintNumber){
    var constraints = this.getConstraints();
    constraints.splice(constraintNumber, 1);
    this.setConstraints(constraints);
    this.refresh();
  },

  setScore: function(name){
    var nodeName = name !== undefined ? name : prompt("Enter node to be modified");
    if (!this.nodeExists(nodeName)){
      alert("ERROR: Unknown node: " + nodeName);
      return;
    }
    var score = prompt("Enter new score");
    if (parseFloat(score).toString() == "NaN") { return; }
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
  
  loadGEXF: function(){
        function handleFileSelect(evt) {
        GraphEditor.progressBar.show();

        // Clean previous information to have a clean graph
        GraphEditor.setGraphNodesJSON({});
        GraphEditor.setGraphEdgesJSON([]);
        GraphEditor.setConstraints([]);

        var files = evt.target.files; // FileList object
    
        for (var i = 0, f; f = files[i]; i++) {
    
          var reader = new FileReader();
    
          // Closure to capture the file information.
          reader.onload = (function(theFile) {
            return function(e) {
              var gexfContent = e.target.result;
              // GEXF IMPORTATION FUNCTION

              // NODES
              $(gexfContent).find('node').each(function(index, item){
                
                // Node custom attributes
                var attributes = {};
                $(this).find('attvalue').each(function(index){
                    attributes[$(this).attr('for').toLowerCase()] = $(this).attr('value');
                });

                // Node position
                attributes["position"] =  {
                    "x":$(this).find('viz\\:position').attr('x'),
                    "y":$(this).find('viz\\:position').attr('y')
                }
                
                GraphEditor.addNode($(this).attr('label'), attributes);
              });

              // EDGES
              $(gexfContent).find('edge').each(function(){

                //  Edge custom attributes
                var attributes = {};
                $(this).find('attvalue').each(function(index){
                    attributes[$(this).attr('for').toLowerCase()] = $(this).attr('value');
                });
                var sourceId = $(this).attr('source');
                var targetId = $(this).attr('target');
                var source = $(gexfContent).find('node#'+sourceId).attr('label');
                var target = $(gexfContent).find('node#'+targetId).attr('label');
                var type = $(this).attr('label');
                GraphEditor.addEdge(source, type, target, attributes);
              });
              GraphEditor.progressBar.hide();
            };
          })(f);
    
          reader.readAsText(f);
        }
      }
    $('#files').bind('change', handleFileSelect);
  },

  refresh: function(){
    var verboseOperator = {
      lt: "less than",
      let: "less or equal than",
      gt: "greater than",
      get: "greater or equal than",
      eq: "equal to",
      neq: "different to"
    }
    //Clear everything
    this.clearLists();
    //Set nodes
    var nodes = this.getGraphNodesJSON();
    var startSelected = false;
    var endSelected = false;
    var nodeTypes = {};
    var startOption;
    var endOption;
    for(var i in nodes){
      startOption = new Option(i, i);
      endOption = new Option(i, i);
      this.addNodeToList(i);
      if (nodes[i].hasOwnProperty('start')){
        this.sourcePath = i;
        startOption = new Option(i, i, true, true);
        startSelected = true;
      }
      if (nodes[i].hasOwnProperty('end')){
        this.targetPath = i;
        endOption = new Option(i, i, true, true);
        endSelected = true;
      }
      nodeTypes[nodes[i]["type"]] = {};
      $('#_start_node').append(startOption);
      $('#_end_node').append(endOption);

      // Update chosen selects with new content
      $('.chzn-select').trigger("liszt:updated");
    }
    //Set default start and end node
    if (!startSelected && Object.keys(nodes).length > 0) {
      this.setStart();
    }
    if (!endSelected && Object.keys(nodes).length > 0) {
      this.setFinish();
    }
    //Set edges
    var edges = this.getGraphEdgesJSON();
    for(var i=0;i<edges.length;i++){
      var edgeText = edges[i].source + " -> " + edges[i].target + " (" + edges[i].type + ")";
      this.addEdgeToList(edgeText);
    }
    //Set constraints
    var constraints = this.getConstraints();
    var constraintText;
    for(var i=0;i<constraints.length;i++){
      constraintText = constraints[i]["type"] + " nodes " +
        verboseOperator[constraints[i]["operator"]] + " " + constraints[i]["value"] +
        '<ul class="actions"><li class="delete-link">' +
        '<a onClick="GraphEditor.deleteConstraint(' + i + ')">delete</a>' +
        '</li></ul>';
      $('#constraint-list').append('<li class="item">' + constraintText + '</li>');
    }
    for(var nodeType in nodeTypes){
      $('#constraint-types').append('<option class="item" value="'+ nodeType+ '">'+nodeType+'</option>');
    }
  },

  init: function(){

    var editorWidget = '<div id="graph-editor" class="form-row">' +
        '<a class="addlink graph-editor" onclick="GraphEditor.addNodeForm()">Add node</a>' +
        '<a class="addlink graph-editor" onclick="GraphEditor.addEdgeForm()">Add edge</a>' +
        '<div id="adding-form"></div>' + 
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
        '<select id="_start_node" class="chzn-select" style="width:300px" onChange="GraphEditor.setStart()">' +
        '</select>' +
        '<hr/>' +
        '<div id="constraints">' +
        '<h3>Constraints</h3>' +
        '<ol id="constraint-list"></ol>' +
        '<span class="constraints">Nodes of type</span>' +
        '<select id="constraint-types"></select>' +
        '<span class="constraints">are</span>' +
        '<select id="constraint-operator">' +
        '<option value="lt">less than</option>' +
        '<option value="let">less or equal than</option>' +
        '<option value="gt">greater than</option>' +
        '<option value="get">greater or equal than</option>' +
        '<option value="eq">equal to</option>' +
        '<option value="neq">different to</option>' +
        '</select>' +
        '<input type="text" id="constraint-value" size="3"/>' +
        '<button type="button" id="add-constraint">Add constraint</button>' +
        '</div>' +
        '<hr/>' +
        '<h3>Finish node</h3>' +
        '<select id="_end_node" class="chzn-select" style="width:300px" onChange="GraphEditor.setFinish()">' +
        '</select>' +
        '</div>';

    $('.controlpanel').before(activityWidget);
    $('#add-constraint').click(function(){

      var constraints = GraphEditor.getConstraints();
      // Constraints limit = 5
      if (constraints.length >= GraphEditor.CONSTRAINTS_LIMIT) {
          alert("You reached the limit of constraints: " + GraphEditor.CONSTRAINTS_LIMIT);
          return;
      }
      var newConstraint = {
        type: $('#constraint-types').val(),
        operator: $('#constraint-operator').val(),
        value: $('#constraint-value').val()
      };
      constraints.push(newConstraint);
      GraphEditor.setConstraints(constraints);
      GraphEditor.refresh();
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
  },

  addNodeForm: function(){
    var form = $('<div>')
      .append($('<label for="node-name">').text("Node name:"))
      .append($('<input type="text" id="node-name">'));
    if (GraphEditor.USES_TYPES) {
      form.append($('<label for="node-type">').text("Node type:"))
        .append($('<input type="text" id="node-type">'));
    }
    form.append($('<br/>'))
      .append($('<button type="button" onClick="GraphEditor.addNode();GraphEditor.hideAddForm();">').text("Add node"));
    form.append($('<button type="button" onClick="GraphEditor.hideAddForm();">').text("Cancel"));
   
    $('#adding-form').empty();
    $('#adding-form').append(form);
  },
  
  addEdgeForm: function(){
    var nodes = GraphEditor.getGraphNodesJSON();

    var nodeSelect = $('<select>');
    var option;

    $.each(nodes, function(i, node){
      option = $('<option>');
      option.attr('value', i);
      option.text(i);
      nodeSelect.append(option);
    });

    var form = $('<div>')
      .append($('<label for="source-node">').text("Source node:"))
      .append(nodeSelect.clone().attr('id', 'source-node'));
    if (GraphEditor.USES_TYPES) {
      form.append($('<label for="edge-type">').text("Relationship type:"))
       .append($('<input type="text" id="edge-type">'));
      form.append($('<label for="edge-inverse-type">').text("Inverse relationship type:"))
       .append($('<input type="text" id="edge-inverse-type">'));
    }
    form.append($('<label for="target-node">').text("Target node:"))
      .append(nodeSelect.clone().attr('id', 'target-node'));
    form.append($('<br/>'))
      .append($('<button type="button" onClick="GraphEditor.addEdge();GraphEditor.hideAddForm();">').text("Add edge"));
    form.append($('<button type="button" onClick="GraphEditor.hideAddForm();">').text("Cancel"));
    
    // Update chosen selects with new content
    $('.chzn-select').trigger("liszt:updated");

    $('#adding-form').empty();
    $('#adding-form').append(form);
  },

  hideAddForm: function(){
    $('#adding-form').empty();
  },
}

$(document).ready(function(){
  GraphEditor.USES_DRAWER = true;
  GraphEditor.USES_TYPES = true;
  GraphEditor.USES_SCORES = true;
  GraphEditor.init();
  GraphEditor.refresh();
  $(".chzn-select").chosen();
});

