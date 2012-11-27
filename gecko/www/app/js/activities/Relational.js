var Relational = {
    activity: null,
    score: null,
    graphNodes: null,
	graphEdges: null,
	constraints: null,
	path_limit: null,
	pathStart: null,
	pathGoal: null,
	pathPosition: null,
	option: null,
	blankOption: null, 
	playerPath: null,
	playerEdgePath: null,
	allConstraintsPassed: null,
	constraintsTextNew: [],
	constraintState: [],
	constraintBoolean: [],
	sigInst:null,
    setup: function(){
        $(document).on('click', '#undoRelational',function(e) {
          Relational.stepBack();
        });
        $(document).on('click', '#constraint',function(e) {
          $("#constraintName").html(Relational.constraintState[$(this).attr('data-index')]);
          $("#constraintDescription").html(Relational.constraintsTextNew[$(this).attr('data-index')]);
        });
        $( "#select-relational" ).bind( "change", function(event, ui) {
			console.log($("#select-relational").val());
			console.log($("#select-relational option:selected").attr("data-edgetype"));			
			Relational.playerEdgePath.push($("#select-relational option:selected").attr("data-edgetype"));
			Relational.takeStep($("#select-relational").val());
			Relational.refreshRel();
        });
    },
    refresh: function(){
		
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            Relational.activity = activity;
	    	Relational.blankOption = i18n.gettext("Choose");
            Relational.playerPath = [];
            Relational.playerEdgePath = [];
        	Relational.allConstraintsPassed = false;
            Relational.score = 20;
            //Import graph nodes and edges from database
            Relational.graphNodes = activity.value.graph_nodes;
            Relational.graphEdges = activity.value.graph_edges;
            Relational.constraints = activity.value.constraints;
            Relational.path_limit = activity.value.path_limit;
            $('#relationalActivityQuery').html(activity.value.query);
            $('#relationalActivityName').html(activity.value.name);
		});
		Relational.start();
	  },
	start: function () 
	{
        //Set the initial step as the initial node and the goal
        for (var i in Relational.graphNodes) 
        {
            if (Relational.graphNodes[i].hasOwnProperty("start")) {
                Relational.pathStart = i;
            }
            else 
            if (Relational.graphNodes[i].hasOwnProperty("end")) {
                Relational.pathGoal = i;
            }
        }
        //Execute first step
        Relational.takeStep(Relational.pathStart);
        Relational.refreshRel(Relational.option);

	
		
	},
	takeStep: function (step)
    {
    
        Relational.pathPosition = step;
        //TODO Add constraints
        if (step === Relational.pathGoal) 
        {
            Relational.successfulGame(this);
            return null;
        }
        else {
            Relational.playerPath.push(step);
            if (Relational.graphNodes[Relational.pathPosition] !== undefined) {
                if (Relational.graphNodes[Relational.pathPosition].score !== undefined && Relational.graphNodes[Relational.pathPosition].score > 0) {
                    Relational.score += parseInt(Relational.graphNodes[Relational.pathPosition].score, 10);
	            }
            }
            Relational.createSelectFromNode(Relational.pathPosition);
        }
		
    },
 	/** This function receives a nodeName and searches into edges
     * data for all the related nodes. It returns a Sencha field.Select
     * object with all the options available */
    createSelectFromNode: function (nodeName)
    {
        var edge;
        var written = [];
        var tipo = "error";
        Relational.blankOption = i18n.gettext("Choose");
        var nodo;
        for (var i = 0; i < Relational.graphEdges.length; i++) {
            edge = Relational.graphEdges[i];
            if (edge.target === nodeName && edge.inverse !== undefined && edge.inverse !== '' && Relational.playerPath.indexOf(edge.source) === -1) {
                for (nodo in Relational.graphNodes) {
                    if (nodo === edge.source) {
                        tipo = Relational.graphNodes[nodo].type;
                    }
                }
                if (Relational.blankOption === i18n.gettext("Choose")) {
                    if (written.indexOf(tipo) === -1) {
                        Relational.blankOption += " " + tipo.toLowerCase();
                    }
                }
                else {
                    if (written.indexOf(tipo) === -1) {
                        Relational.blankOption += ", " + tipo.toLowerCase();
                    }
                }
                written.push(tipo);
                
            }
            if (edge.source === nodeName && Relational.playerPath.indexOf(edge.target) === -1) {
                for (nodo in Relational.graphNodes) {
                    if (nodo === edge.target) {
                        tipo = Relational.graphNodes[nodo].type;
                    }
                }
                if (Relational.blankOption === i18n.gettext("Choose")) {
                    if (written.indexOf(tipo) === -1) {
                        Relational.blankOption += " " + tipo.toLowerCase();
                    }
                }
                else {
                    if (written.indexOf(tipo) === -1) {
                        Relational.blankOption += ", " + tipo.toLowerCase();
                    }
                }
                if (written.indexOf(tipo) === -1) {
                
                    written.push(tipo);
                }
            }
        }
        var options = [{
            text: Relational.blankOption
        }];
        for (i = 0; i < Relational.graphEdges.length; i++) {
            edge = Relational.graphEdges[i];
            if (edge.target === nodeName && edge.inverse !== undefined && edge.inverse !== '' && Relational.playerPath.indexOf(edge.source) === -1) {
                options.push({
                    text: edge.inverse + ' ' + edge.source,
                    value: edge.source,
                    edgeType: edge.inverse,
                    width: '100%'
                });
            }
            else 
            if (edge.source === nodeName && Relational.playerPath.indexOf(edge.target) === -1) 
            {
                options.push({
                        text: edge.type + ' ' + edge.target,
                        value: edge.target,
                        edgeType: edge.type
                    });
            }
        }

        $("#select-relational").empty();
		for(var k=0;k<options.length;k++)
		{
			$("#select-relational").append('<option data-edgetype="'+options[k].edgeType+'" value="'+options[k].value+'">'+options[k].text+'</option>');
		}
    },
	refreshRel: function (option)
    {
        $('#nodesWalked').empty();
        for (var i = 0; i < Relational.playerPath.length; i++) {
            if (i !== 0) {
                var edgeText = '<p class="relational">' + Relational.playerEdgePath[i - 1] + '</p>';
                $('#nodesWalked').append(edgeText);
                
            }
            
            $('#nodesWalked').append(Relational.getNodeHTML(Relational.playerPath[i]));
        }
        
		$('#finalNode').empty();
		$('#finalNode').append(Relational.getNodeHTML(Relational.pathGoal));
        if (option)
        {
            if (option.getOptions().length > 1)
            {
                gamePanel.add(option);    
            } else
            {
                gamePanel.add({xtype: 'panel', html: "<div class='warning'>" + i18n.gettext('Sorry, from here you cannot reach') + " " + pathGoal + ". " + i18n.gettext('Try undo') + "<div>"});
            }
        }
        if (option)
        {
            if (option.getOptions().length > 1)
            {
                gamePanel.add(endNode);
            }
        }
        
		Relational.getContraintsHTML();
		Relational.refreshConstraints();
		//Sigma
		var sigRoot = document.getElementById('sig');
		if(Relational.sigInst == null)
		Relational.sigInst = sigma.init(sigRoot);
		Relational.sigInst.drawingProperties({
			defaultLabelColor: '#fff',
			defaultLabelSize: 14,
			defaultLabelBGColor: '#fff',
			defaultLabelHoverColor: '#000',
			labelThreshold: 6,
			defaultEdgeType: 'curve'
		  }).graphProperties({
			minNodeSize: 0.5,
			maxNodeSize: 15,
			minEdgeSize: 1,
			maxEdgeSize: 1
		  }).mouseProperties({
			maxRatio: 1,
			mouseEnabled: false
		  });
		console.log(Relational.playerPath);
		for(var i=0;i<Relational.playerPath.length;i++)
		{
			Relational.sigInst.addNode(Relational.playerPath[i],{
			  label: Relational.playerPath[i],
			  color: '#444400',
			  y:i/4
			});
		}
		//Relational.sigInst.addEdge('hello_world','hello','world');
		Relational.sigInst.draw();


		//FIN Sigma
    },
	getNodeHTML: function (nodeName)
	{
		return '<p class="relational">' + nodeName + ' (' + Relational.graphNodes[nodeName].type + ')' + '</p>';
	},
	refreshConstraints: function() {
		console.log(Relational);
		var icon="plus";
		$("#constraintsBar").empty();
		for(var i=0; i < Relational.constraints.length ; i ++)
		{
			if(!Relational.constraintBoolean[i])
			{
				icon="delete";
			}
			else
			{
				icon="plus";
			}
			$("#constraintsBar").append('<a href="#dialogRelational" data-role="button" data-rel="dialog" data-icon="'+icon+'" data-index="'+i+'" id="constraint">Constraint '+i+'</a>');
		}
		i++;
		icon = "plus";
        if (Relational.path_limit > 0)
        {
			if(Relational.path_limit<Relational.playerPath.length)
			{
				icon="delete";
			}
			else
			{
				icon="plus";
			}
			$("#constraintsBar").append('<a href="#dialogRelational" data-role="button" data-rel="dialog" data-icon="'+icon+'" data-index="'+i+'" id="constraint">Constraint '+i+'</a>');
		}
		$('#relational').trigger('create');  
	},

	getContraintsHTML: function()
    {
        var constraintClass;
        var icontype;
        var uitype;
        var oldStateTemp;
        var temp;
        var changed;
        Relational.allConstraintsPassed = true;
        for (var i = 0; i < Relational.constraints.length; i++) {
            changed = false;
            Relational.constraintsTextNew[i] = "";
            Relational.constraintState[i] = "";
            
           if (Relational.constraintPassed(Relational.constraints[i])) {
                constraintClass = "relational-constraint-passed";
                icontype = 'star';
                uitype = 'confirm';
                if (Relational.constraintBoolean[i] !== true && Relational.constraintBoolean[i] !== undefined)
                {
                    changed = true;
                }
                Relational.constraintState[i] = i18n.gettext('Fulfilled condition');
                Relational.constraintBoolean[i] = true;
            }
            else {
                constraintClass = "relational-constraints";
                Relational.allConstraintsPassed = false;
                icontype = 'delete';
                uitype = 'decline';
                if (Relational.constraintBoolean[i] !== false && Relational.constraintBoolean[i] !== undefined)
                {
                    changed = true;
                }
                Relational.constraintState[i] = i18n.gettext('Condition not fulfilled yet');
                Relational.constraintBoolean[i] = false;
            }
            switch (Relational.constraints[i].operator) {
            case "eq":
                Relational.constraintsTextNew[i] += i18n.translate("Pass through %s %s").fetch(Relational.constraints[i].value, Relational.constraints[i].type);
                break;
            case "neq":
                Relational.constraintsTextNew[i] += i18n.translate("Pass through other than %s %s").fetch(Relational.constraints[i].value, Relational.constraints[i].type);
                break;
            case "let":
            case "lte":
                Relational.constraintsTextNew[i] += i18n.translate("Pass through %s or fewer %s").fetch(Relational.constraints[i].value, Relational.constraints[i].type);
                break;
            case "gte":
            case "get":
                Relational.constraintsTextNew[i] += i18n.translate("Pass through %s or more %s").fetch(Relational.constraints[i].value, Relational.constraints[i].type);
                break;
            case "lt":
                Relational.constraintsTextNew[i] += i18n.translate("Pass through less than %s %s").fetch(Relational.constraints[i].value, Relational.constraints[i].type);
                break;
            case "gt":
                Relational.constraintsTextNew[i] += i18n.translate("Pass through more than %s %s").fetch(Relational.constraints[i].value, Relational.constraints[i].type);
                break;
            }
            
        }
        i++;
        if (Relational.path_limit > 0)
        {
            changed = false;
            Relational.constraintsTextNew[i] = "";
            Relational.constraintState[i] = "";
            if (Relational.playerPath.length <= Relational.path_limit) {
                constraintClass = "relational-constraint-passed";
                icontype = 'star';
                uitype = 'confirm';
                if (Relational.constraintBoolean[i] === false)
                {
                    changed = true;
                }
                Relational.constraintState[i] = i18n.gettext('Fulfilled condition');
                Relational.constraintBoolean[i] = true;
            }
            else {
                constraintClass = "relational-constraints";
                Relational.allConstraintsPassed = false;
                icontype = 'delete';
                uitype = 'decline';
                if (Relational.constraintBoolean[i] === true)
                {
                    changed = true;
                }
                Relational.constraintState[i] = i18n.gettext('Condition not fulfilled yet');
                Relational.constraintBoolean[i] = false;
            }
            Relational.constraintsTextNew[i] += i18n.translate('Your path must have %d or fewer steps').fetch(Relational.path_limit);
            /*
             * If state of constraint has changed button has animation fade
             */
            
        }
        
        
    },
	constraintPassed: function (constraint)
    {
        var counted = [];
        var elementCount = 0;
        var constraintValue = parseInt(constraint.value, 10);
        for (var i = 0; i < Relational.playerPath.length; i++) {
            if (constraint.type === Relational.graphNodes[Relational.playerPath[i]].type && counted.indexOf(Relational.playerPath[i]) === -1) {
                counted.push(Relational.playerPath[i]);
                elementCount++;
            }
        }
        switch (constraint.operator) {
        case "eq":
            return (elementCount === constraintValue);
        case "neq":
            return (elementCount !== constraintValue);
        case "let":
        case "lte":
            return (elementCount <= constraintValue);
        case "get":
        case "gte":
            return (elementCount >= constraintValue);
        case "lt":
            return (elementCount < constraintValue);
        case "gt":
            return (elementCount > constraintValue);
        default:
            return false;
        }
    },
	stepBack: function ()
    {
        var previousStep;
        if (Relational.playerPath.length > 1) {
            previousStep = Relational.playerPath[Relational.playerPath.length - 2];
            Relational.playerPath.splice(Relational.playerPath.length - 2, 2);
            Relational.playerEdgePath.splice(Relational.playerEdgePath.length - 1, 1);
            Relational.option = Relational.takeStep(previousStep);
            Relational.refreshRel(Relational.option);
        }
		Relational.refreshConstraints();
    },
 	successfulGame: function ()
    {
        if (Relational.score > 100)
        {
            Relational.score = 100;
        }
        if (Relational.allConstraintsPassed) {
		$.mobile.changePage("#dialog")
        $('#dialogText').html(Relational.activity.value.reward+". "+i18n.gettext('Score')+":"+Relational.score);
		Dao.activityPlayed(Relational.activity.value.id, true, Relational.score);
        }
    }
                
}
