Ext.define('DrGlearning.controller.activities.RelationalController', {
  extend: 'Ext.app.Controller',
  requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
  views: ['ActivityFrame', 'activities.Relational'],
  controllers: ['DrGlearning.controller.Careers','DrGlearning.controller.DaoController'],
  stores: ['Careers','Levels','Activities'],
  refs: [{
    ref: 'activities.reospatial',
    selector: 'mainview',
    autoCreate: true,
    xtype: 'mainview'
  }],  
  updateActivity: function(view, newActivity) {
	var daocontroller = this.getController('DaoController');
	var careerscontroller = this.getController('Careers');
    var blankOption = "- - -";
    var playerPath = [];
    var pathStart, pathGoal, pathPosition;
    var option;
    var activityView;
    
    //Import graph nodes and edges from database
    var graphNodes = newActivity.data.graph_nodes;
    var graphEdges = newActivity.data.graph_edges;
    var constraints = newActivity.data.constraints;
  
    /** This function receives a nodeName and searches into edges
     * data for all the related nodes. It returns a Sencha field.Select
     * object with all the options available */
    function createSelectFromNode(nodeName){
      var edge;
      var options = [{text:blankOption}];
      for(var i=0;i<graphEdges.length;i++){
        edge = graphEdges[i];
        if (edge.target===nodeName){
          options.push({text: edge.source + ' (' + edge.type +')', value: edge.source,width:'100%'});
        } else if (edge.source===nodeName){
          options.push({text: edge.target + ' (' + edge.type +')', value: edge.target});
        }
      }
      return Ext.create('Ext.field.Select' ,{
        options: options,
        listeners: {
          change: function(field, newValue, oldValue){
            if (newValue.data.text!=blankOption){
              option.hide();
              option = takeStep(newValue.data.value);
              refresh(option);
            }
          }
        }
      });
    }
  
    /**
     * Given a step adds it to the path. If the step is the goal node
     * and all the constraints are met, the game is successfully over.
     * Otherwise, it pushes the step into the players path and queries
     * all the posible next steps to the edges data */
    function takeStep(step){
      pathPosition = step;
      //TODO Add constraints
      if (step==pathGoal){
        successfulGame();
        return null;
      } else {
        playerPath.push(step);
        return createSelectFromNode(pathPosition)
      }
    }
  
    function getNodeHTML(nodeName){
      return '<p class="node">' + nodeName + ' (' + graphNodes[nodeName]["type"] + ')' + '</p>'
    }
  
    function getContraintsHTML(){
      var constraintsText;
      constraintsText = '<p class="constraints">Solve the riddle with the following constraints:<br/><ul>';
      for(var i=0;i<constraints.length;i++){
        constraintsText += '<li>';
        constraintsText += constraints[i]["type"] + ' ';
        constraintsText += constraints[i]["operator"] + ' ';
        constraintsText += constraints[i]["value"] + '<br/>';
        constraintsText += '</li>';
      }
      constraintsText += '</ul></p>';
      return constraintsText;
    }

    function stepBack(){
      var previousStep;
      if (playerPath.length>1){
        previousStep = playerPath[playerPath.length-2];
        playerPath.splice(playerPath.length-2,2);
        option.hide();
        option = takeStep(previousStep);
        refresh(option);
      }
    }
  
    /** Given the last step, it refreshes the user interface to mark the
     * actual walked path and next options available */
    function refresh(option){
      activityView = Ext.create('DrGlearning.view.activities.Relational');
      activityView.down('label').setHtml(newActivity.data.query);
      var constraintsPanel = Ext.create('Ext.Panel', {
        html: getContraintsHTML()
      });
      activityView.add(constraintsPanel);
      for(var i=0;i<playerPath.length;i++){
        var node = Ext.create('Ext.Panel' , {
          html: getNodeHTML(playerPath[i])
        });
        activityView.add(node);
      }
      var endNode = Ext.create('Ext.Panel' , {
         html: getNodeHTML(pathGoal)
      });
      var button = Ext.create('Ext.Button', {
        text: 'Step back',
        handler: function() {
          stepBack();
        }
      });
      activityView.add(option);
      activityView.add(endNode);
      activityView.add(button);
      view.add(activityView);
    }
  
    function successfulGame(){
        console.log(newActivity.data.reward);
		Ext.Msg.alert('Right!', newActivity.data.reward, function(){
				daocontroller.activityPlayed(newActivity.data.id,true,500);
				careerscontroller.nextActivity();
			}, this);
    }
  
    //Set the initial step as the initial node and the goal
    for(var i in graphNodes){
      if (graphNodes[i].hasOwnProperty("start")){
        pathStart = i;
      } else if (graphNodes[i].hasOwnProperty("end")) {
        pathGoal = i;
      }
    }
  
    //Execute first step
    option = takeStep(pathStart);
    refresh(option);
  }
});
