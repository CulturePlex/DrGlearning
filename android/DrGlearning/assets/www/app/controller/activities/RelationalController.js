Ext.define('DrGlearning.controller.activities.RelationalController', {
  extend: 'Ext.app.Controller',
  requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
  views: ['ActivityFrame', 'activities.Relational'],
  controllers: ['DrGlearning.controller.Careers'],
  stores: ['Careers','Levels','Activities'],
  refs: [{
    ref: 'activities.reospatial',
    selector: 'mainview',
    autoCreate: true,
    xtype: 'mainview'
  }],  
  updateActivity: function(view, newActivity) {

    var blankOption = "- - -";
    var playerPath = [];
    var pathStart, pathGoal, pathPosition;
    var option;
    var activityView;
    
    //Import graph nodes and edges from database
    //var graphNodes = JSON.parse(newActivity.data.graph_nodes);
    //var graphEdges = JSON.parse(newActivity.data.graph_edges);
    var graphNodes = { "Sam": { "score": 0, "type": "Character" }, "Tolkien": { "start": true, "score": 0, "type": "Author" }, "LOTR": { "type": "Book", "score": 0}, "Gollum": { "score": 0, "type": "Character", "end": true}, "Frodo": { "score": 0, "type": "Character" }, "Bilbo": { "score": 0, "type": "Character" }, "The Hobbit": { "score": 0, "type": "Book" } };
    var graphEdges = [ { "source": "Tolkien", "type": "wrote", "target": "LOTR" }, { "source": "Tolkien", "type": "wrote", "target": "The Hobbit" }, { "source": "Sam", "type": "appears in", "target": "LOTR" }, { "source": "Frodo", "type": "appears in", "target": "LOTR" }, { "source": "Bilbo", "type": "appears in", "target": "LOTR" }, { "source": "Bilbo", "type": "appears in", "target": "The Hobbit" }, { "source": "Frodo", "type": "knows", "target": "Gollum" }, { "source": "Sam", "type": "knows", "target": "Gollum" }, { "source": "Bilbo", "type": "knows", "target": "Gollum" } ];
  
    /** This function receives a nodeName and searches into edges
     * data for all the related nodes. It returns a Sencha field.Select
     * object with all the options available */
    function createSelectFromNode(nodeName){
      var edge;
      var options = [{text:blankOption}];
      for(var i=0;i<graphEdges.length;i++){
        edge = graphEdges[i];
        if (edge.target===nodeName){
          options.push({text: edge.source + ' (' + edge.type +')', value: edge.source});
        } else if (edge.source===nodeName){
          options.push({text: edge.target + ' (' + edge.type +')', value: edge.target});
        }
      }
      return Ext.create('Ext.field.Select' ,{
        options: options,
        listeners: {
          change: function(field, newValue, oldValue){
            if (newValue.data.text!=blankOption){
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
  
    function stepBack(){
      var previousStep;
      console.log("BACK");
      if (playerPath.length>1){
        previousStep = playerPath[playerPath.length-2];
        playerPath.splice(playerPath.length-2,1);
        option = takeStep(previousStep);
        refresh(option);
      }
    }
  
    /** Given the last step, it refreshes the user interface to mark the
     * actual walked path and next options available */
    function refresh(option){
      activityView = Ext.create('DrGlearning.view.activities.Relational');
      activityView.down('title').setTitle(newActivity.data.query);
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
        listeners: {
        // TODO click: stepBack()
        }
      });
      activityView.add(option);
      activityView.add(endNode);
      activityView.add(button);
      view.add(activityView);
    }
  
    function successfulGame(){
        console.log(newActivity.data.reward)
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
