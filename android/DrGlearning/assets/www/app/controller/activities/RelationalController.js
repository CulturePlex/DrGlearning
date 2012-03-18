Ext.define('DrGlearning.controller.activities.RelationalController', {
  extend: 'Ext.app.Controller',
  config: {
		fullscreen:true,
        refs: {
            relational: 'activities.relational',
            activityframe: 'activityframe',
        }
    },

  updateActivity: function(view, newActivity) {
		
  	/*if(view.down('component[customId=activity]'))
	{
		view.down('component[customId=activity]').hide();
		view.down('component[customId=activity]').destroy();
	}*/
	
	console.log(view);
	this.activity= newActivity;
	view.down('component[customId=activity]').destroy();
	/*activityView = Ext.create('DrGlearning.view.activities.Relational');
	
	
	activityView.show();
	view.add(activityView);*/
		
	activityView = Ext.create('DrGlearning.view.activities.Relational');
    activityView.down('label').setHtml(newActivity.data.query);
	  
	console.log(this);
    var daocontroller = this.getApplication().getController('DaoController');
    var careerscontroller = this.getApplication().getController('CareersListController');
	var activitiescontroller = this.getApplication().getController('LevelController');
    var blankOption = "- - -";
    var playerPath = [];
    var playerEdgePath = [];
    var pathStart, pathGoal, pathPosition;
    var option;
    var activityView;
    var allConstraintsPassed = false;

    var verboseOperator = {
      lt: "less than",
      lte: "less or equal than",
      gt: "greater than",
      gte: "greater or equal than",
      eq: "equals to",
      neq: "different to"
    }

    //Import graph nodes and edges from database
    var graphNodes = newActivity.data.graph_nodes;
    var graphEdges = newActivity.data.graph_edges;
    var constraints = newActivity.data.constraints;
	
	console.log(graphNodes);
  
    /** This function receives a nodeName and searches into edges
     * data for all the related nodes. It returns a Sencha field.Select
     * object with all the options available */
    function createSelectFromNode(nodeName){
      var edge;
      var options = [{text:blankOption}];
      for(var i=0;i<graphEdges.length;i++){
        edge = graphEdges[i];
        if (edge.target===nodeName){
          options.push({text: edge.source + ' (' + edge.type +')',
                        value: edge.source,
                        edgeType: edge.type,
                        width:'100%'});
        } else if (edge.source===nodeName){
          options.push({text: edge.target + ' (' + edge.type +')',
                        value: edge.target,
                        edgeType: edge.type});
        }
      }
      return Ext.create('Ext.field.Select' ,{
        options: options,
        listeners: {
          change: function(field, newValue, oldValue){
            if (newValue.data.text!=blankOption){
			  console.log(newValue);
              option.hide();
			  //scorePanel.hide();
              playerEdgePath.push(newValue.raw.edgeType);
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
        if (graphNodes[pathPosition]["score"] != undefined && graphNodes[pathPosition].score > 0) {
          Ext.Msg.alert('Congratulations!', 'You get ' + graphNodes[pathPosition].score+ ' points!', function(){}, this);
        }
        return createSelectFromNode(pathPosition)
      }
    }
  
    function getNodeHTML(nodeName){
      return '<p class="relational">' + nodeName + ' (' + graphNodes[nodeName]["type"] + ')' + '</p>'
    }

    function constraintPassed(constraint){
      var elementCount = 0;
      var constraintValue = parseInt(constraint["value"]);
      for(var i=0;i<playerPath.length;i++){
        if (constraint["type"] === graphNodes[playerPath[i]]["type"]) {
          elementCount++;
        }
      }
      switch(constraint["operator"]) {
        case "eq": return (elementCount===constraintValue);
        case "neq": return (elementCount!=constraintValue);
        case "let": return (elementCount<=constraintValue);
        case "get": return (elementCount>=constraintValue);
        case "lt": return (elementCount<constraintValue);
        case "gt": return (elementCount>constraintValue);
        default: return false;
      }
    }

    function getContraintsHTML(){
      var constraintsText;
      var constraintClass;
      allConstraintsPassed = true;
      constraintsText = '<p class="relational">Solve the riddle with the following constraints:<br/><ul>';
      for(var i=0;i<constraints.length;i++){
        if (constraintPassed(constraints[i])){
          constraintClass = "relational-constraint-passed";
        } else {
          constraintClass = "relational-constraints";
          allConstraintsPassed = false;
        }
        constraintsText += '<li class="relational ' + constraintClass + '">- Nodes of type ';
        constraintsText += constraints[i]["type"] + ' ';
        constraintsText += verboseOperator[constraints[i]["operator"]] + ' ';
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
        playerEdgePath.splice(playerEdgePath.length-1,1);
        option.hide();
		
        option = takeStep(previousStep);
        refresh(option);
      }
    }

    function getPathScore(){
      var score = 0;
      var node;
      for(var i=0;i<playerPath.length;i++){
        node = graphNodes[playerPath[i]];
        if (node.score != undefined ) {
          score += parseInt(node.score);
        }
      }
      return score;
    }

    /** Given the last step, it refreshes the user interface to mark the
     * actual walked path and next options available */
    function refresh(option){
	  activityView.removeAll();
		//console.log(activityView.down('panel'));
	  //activityView.down('panel')[0].hide();
      var scorePanel = Ext.create('Ext.Panel', {
        html: '<p>Score: ' + getPathScore() + '</p>'
      });
      activityView.add(scorePanel);
      var constraintsPanel = Ext.create('Ext.Panel', {
        html: getContraintsHTML()
      });
      activityView.add(constraintsPanel);
      for(var i=0;i<playerPath.length;i++){
	  	console.log(playerEdgePath);
        if (i!=0) {
          var edgeText = '<p class="relational">&lt;' + playerEdgePath[i-1] + '&gt;</p>';
          var edge = Ext.create('Ext.Panel' , {
            html: edgeText
          });
          activityView.add(edge);
        }
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
	  activityView.show();
      view.add(activityView);
	  console.log(view);
    }
  
    function successfulGame(context){
      if (allConstraintsPassed) {
        Ext.Msg.alert('Right!', newActivity.data.reward, function(){
          daocontroller.activityPlayed(newActivity.data.id,true,500);
		  console.log(DrGlearning);
          DrGlearning.app.getController('LevelController').nextActivity(newActivity.data.level_type);
        }, this);
      }
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
