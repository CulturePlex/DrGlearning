Ext.define('DrGlearning.controller.activities.RelationalController', {
  extend: 'Ext.app.Controller',
  config: {
		fullscreen:true,
        refs: {
            relational: 'activities.relational',
            activityframe: 'activityframe',
        }
    },
	activityView:null,
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
	this.activityView=activityView;
    this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);
	  
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
      get: "greater or equal than",
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
      return Ext.create('Ext.form.Select' ,{
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
		if (graphNodes[pathPosition]!=undefined)
		{
	        if (graphNodes[pathPosition]["score"] != undefined && graphNodes[pathPosition]["score"] > 0) {
	          Ext.Msg.alert('Congratulations!', 'You get ' + graphNodes[pathPosition].score+ ' points!', function(){}, this);
	        }
		}
        return createSelectFromNode(pathPosition)
      }
    }
  
    function getNodeHTML(nodeName){
		console.log(graphNodes);
		console.log(nodeName);
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
	var constraintsTextNew=[];
	var constraintState=[];
    function getContraintsHTML(){
      var constraintClass;
	  var icontype;
      allConstraintsPassed = true;
      constraintsText = '<p class="relational">Solve the riddle with the following constraints:<br/><ul>';
	  activityView.down('toolbar[customId=constraintsbar]').removeAll();
	  activityView.down('toolbar[customId=constraintsbar]').add({xtype:'spacer'});
      for(var i=0;i<constraints.length;i++){
	  	constraintsTextNew[i]="";
		constraintState[i]="";
        if (constraintPassed(constraints[i])){
          constraintClass = "relational-constraint-passed";
		  icontype='star';
		  constraintState[i]='Constraint Passed';
		  
        } else {
          constraintClass = "relational-constraints";
          allConstraintsPassed = false;
		  icontype='delete';
		  constraintState[i]='Constraint Not Passed Yet';
        }
        constraintsText += '<li class="relational ' + constraintClass + '">- Nodes of type ';
		constraintsTextNew[i] += 'Nodes of type ';
        constraintsText += constraints[i]["type"] + ' ';
		constraintsTextNew[i] += constraints[i]["type"] + ' should be ';
        constraintsText += verboseOperator[constraints[i]["operator"]] + ' ';
		constraintsTextNew[i] += verboseOperator[constraints[i]["operator"]] + ' ';
        constraintsText += constraints[i]["value"] + '<br/>';
		constraintsTextNew[i] += constraints[i]["value"];
        constraintsText += '</li>';
		console.log(constraints[i]["operator"]);
		activityView.down('toolbar[customId=constraintsbar]').add(
			{
				xtype:'button',
				iconCls: icontype,
				customId: i,
				listeners: {
					tap: function(i){
						showConstraint(i);
					}
				}
			});
		
		
      }
	  activityView.down('toolbar[customId=constraintsbar]').add({xtype:'spacer'});
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
      activityView.down('container[customId=scorebar]').add(scorePanel);
	  getContraintsHTML();
      /*var constraintsPanel = Ext.create('Ext.Panel', {
        html: getContraintsHTML()
      });
      activityView.add(constraintsPanel);*/
      for(var i=0;i<playerPath.length;i++){
	  	console.log(playerEdgePath);
        if (i!=0) {
          var edgeText = '<p class="relational">&lt;' + playerEdgePath[i-1] + '&gt;</p>';
          var edge = Ext.create('Ext.Panel' , {
            html: edgeText
          });
          activityView.add(edge);
        }
		console.log(playerPath);
		console.log(i);
        var node = Ext.create('Ext.Panel' , {
          html: getNodeHTML(playerPath[i])
        });
        activityView.add(node);
      }
	  	console.log(pathGoal);
      var endNode = Ext.create('Ext.Panel' , {
         html: getNodeHTML(pathGoal)
      });
      var button = Ext.create('Ext.Button', {
        text: 'Undo',
        handler: function() {
          stepBack();
        }
      });
      activityView.add(option);
      activityView.add(endNode);
      activityView.add(button);
	  activityView.show();
      view.add(activityView);
	  console.log(activityView);
	  var scroller=activityView.getScrollable().getScroller();
	  console.log(scroller);
	  console.log('scroller');
	  scroller.scrollBy(0,40);
    }
  
    function successfulGame(context){
		this.puntos=500;
      if (allConstraintsPassed) {
        Ext.Msg.alert('Right!', newActivity.data.reward+" obtained score: "+this.puntos, function(){
          daocontroller.activityPlayed(newActivity.data.id,true,this.puntos);
		  console.log(DrGlearning);
          DrGlearning.app.getController('LevelController').nextActivity(newActivity.data.level_type);
        }, this);
      }
    }
	
	function showConstraint(button){
		console.log(button);
		Ext.Msg.alert(constraintState[button.config.customId],  constraintsTextNew[button.config.customId], function(){
						}, this);
    }
  
    //Set the initial step as the initial node and the goal
    for(var i in graphNodes){
      if (graphNodes[i].hasOwnProperty("start")){
        pathStart = i;
      } else if (graphNodes[i].hasOwnProperty("end")) {
	  	 console.log(pathGoal);
        pathGoal = i;
      }
	 
    }
  
    //Execute first step
    option = takeStep(pathStart);
    refresh(option);
	if(!this.helpFlag)
	{
		this.getApplication().getController('LevelController').help();
		this.helpFlag=true;
	}
  }
});
