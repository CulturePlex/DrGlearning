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
	undoNodes: [],
	playerEdgePath: null,
	allConstraintsPassed: null,
	constraintsTextNew: [],
	constraintState: [],
	constraintBoolean: [],
	sigInst:null,
	temp: null,
	helpViewed: false,
    setup: function(){
        $(document).on('click', '#undoRelational',function(e) {
          Relational.stepBack();
        });
        $(document).on('click', '#constraint',function(e) {
          $("#constraintName").html(Relational.constraintState[$(this).attr('data-index')]);
          $("#constraintDescription").html(Relational.constraintsTextNew[$(this).attr('data-index')]);
        });
        $( "#select-relational" ).bind( "change", function(event, ui) {
			Relational.playerEdgePath.push($("#select-relational option:selected").attr("data-edgetype"));
			Relational.takeStep($("#select-relational").val());
			Relational.refreshRel();
        });
		//Hiding HTML nodes list
		$("#nodesWalked").hide();
		$("#finalNode").hide();
    },
    refresh: function(){
		
        Dao.activitiesStore.get(DrGlearning.activityId,function(activity){ 
            console.log(activity);
            Relational.activity = activity;
	    	Relational.blankOption = i18n.gettext("Choose");
            Relational.playerPath = [];
            Relational.undoNodes = [];
            Relational.playerEdgePath = [];
        	Relational.allConstraintsPassed = false;
            Relational.score = 50;
            //Import graph nodes and edges from database
            Relational.graphNodes = activity.value.graph_nodes;
            Relational.graphEdges = activity.value.graph_edges;
            Relational.constraints = activity.value.constraints;
            Relational.path_limit = activity.value.path_limit;
            $('#relationalActivityQuery').html(activity.value.query);
            $('#relationalActivityName').html(activity.value.name);
		});
		Relational.start();
		if(!Relational.helpViewed)
		{
			$('#infoRelational').click();
			Relational.helpViewed = true;
		}
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
		//Normalizing scores total to 50, extra score only on nodes
		var totalScores = 0;
        for (var i in Relational.graphNodes) 
        {
			if (Relational.graphNodes[i].score !== 0) {
                totalScores += parseInt(Relational.graphNodes[i].score,10);
            }
        }
		for (var i in Relational.graphNodes)
		{
			if (Relational.graphNodes[i].score !== 0) {
				Relational.graphNodes[i].score = Math.round(parseInt(Relational.graphNodes[i].score,10)*50/totalScores);
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
					Workflow.toActivity = true;
					Workflow.toRelational = true;
                    $('#dialogText').html('Congratulations! You got '+Relational.graphNodes[Relational.pathPosition].score+' points!');
					$.mobile.changePage("#dialog");  
	            }
            }
            Relational.createSelectFromNode(Relational.pathPosition);
        }
		
    },
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
		if(options.length == 1)
		{
			$("#select-relational").empty();
			$("#select-relational").append('<option data-edgetype="" value="">'+i18n.gettext("Uups, no way to reach ")+Relational.pathGoal+'</option>');
		}
		$("#select-relational").selectmenu('refresh');
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
		Relational.temp = setTimeout(Relational.refreshSigma,200);

    },
	refreshSigma: function ()
	{
		//Sigma
		$('#sig').empty();
		var sigRoot = document.getElementById('sig');

		Relational.sigInst = sigma.init(sigRoot);
		Relational.sigInst.drawingProperties({
		    defaultLabelColor: '#fff',
			defaultLabelSize: 14,
			defaultLabelBGColor: '#fff',
			defaultLabelHoverColor: '#000',
			labelThreshold: 0,
		  }).graphProperties({
			minNodeSize: 1,
			maxNodeSize: 15,
			minEdgeSize: 1,
			maxEdgeSize: 11
		  }).mouseProperties({
			maxRatio: 1,
			mouseEnabled: false
		  });
		//console.log(Relational.playerPath);
		var temp;
		for(var i=0;i<Relational.playerPath.length;i++)
		{
			temp = "#" + Math.abs(GlobalSettings.hashCode(Relational.graphNodes[Relational.playerPath[i]].type)).toString(16).toUpperCase().slice(0,6);
			//console.log(temp);
			if(i==0)
			{
			Relational.sigInst.addNode(Relational.playerPath[i]+121212,{
			  label: '',
			  color: '#FFFF00',
			  size: 1.7,
			  y:(i+1)/Relational.playerPath.length
			});
			}
			Relational.sigInst.addNode(Relational.playerPath[i],{
			  label: Relational.playerPath[i],
			  color: temp,
			  size: 1,
			  y:(i+1)/Relational.playerPath.length
			});
			
			
			if(i>0)	
			{
				Relational.sigInst.addNode(Relational.playerEdgePath[i-1]+Relational.playerPath[i],{
				  label: Relational.playerEdgePath[i-1],
				  color: '#400000',
				  size:0.1,
				  y:((i+1)/Relational.playerPath.length)-1/(Relational.playerPath.length*2)
				});
				//console.log(Relational);
				Relational.sigInst.addEdge(Relational.playerEdgePath[i-1]+Math.random(),Relational.playerPath[i-1],Relational.playerPath[i]);					
			}
		}
		//console.log(Relational.undoNodes);
		for(var i=0;i<Relational.undoNodes.length;i++)
		{
			if(Relational.playerPath.indexOf(Relational.undoNodes[i].name)==-1)
			{
				Relational.sigInst.addNode(Relational.undoNodes[i].name,{
				  label: Relational.undoNodes[i].name,
				  color: "#E5E5E5",
				  y:1.3
				  //x:Relational.undoNodes[i].x,
				});
				Relational.sigInst.addEdge('lastEdge',Relational.undoNodes[i].name,Relational.playerPath[i]);
			}
		}
		//console.log(Relational.pathGoal);
		if(Relational.playerPath.indexOf(Relational.pathGoal)==-1)
		{
			Relational.sigInst.addNode(Relational.pathGoal+121212,{
			  label: '',
			  color: '#FFFF00',
			  size: 1.7,
			  y:1.6
			});
			var temp2 = "#" + Math.abs(GlobalSettings.hashCode(Relational.graphNodes[Relational.pathGoal].type)).toString(16).toUpperCase().slice(0,6);
			Relational.sigInst.addNode(Relational.pathGoal,{
			  label: Relational.pathGoal,
			  color: temp2,
			  y:1.6
			});
		}
		Relational.sigInst.draw();

		Relational.sigInst.iterNodes(function(n){
		 n.active = true; 
		}).refresh();
		Relational.undoNodes=[];
		//FIN Sigma

	},
	getNodeHTML: function (nodeName)
	{
		return '<p class="relational">' + nodeName + ' (' + Relational.graphNodes[nodeName].type + ')' + '</p>';
	},
	refreshConstraints: function() {
		//console.log(Relational);
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
			if(Relational.undoNodes.indexOf(Relational.playerPath[Relational.playerPath.length-1]) == -1)
			{
				//console.log("sacando"+Relational.playerPath[Relational.playerPath.length-1]);
				Relational.undoNodes=[];
				Relational.undoNodes.push({name:Relational.playerPath[Relational.playerPath.length-1],y:1.5,x:0});
			}
            previousStep = Relational.playerPath[Relational.playerPath.length - 2];
            Relational.playerPath.splice(Relational.playerPath.length - 2, 2);
            Relational.playerEdgePath.splice(Relational.playerEdgePath.length - 1, 1);
            Relational.option = Relational.takeStep(previousStep);
            Relational.refreshRel(Relational.option);
			/////////////////////////////////7Relational.playerPath.length
			

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
			$.mobile.changePage('#dialog', {transition: 'pop', role: 'dialog'});   
		    $('#dialogText').html(Relational.activity.value.reward+"<br /><br />"+i18n.gettext('Score')+": "+Relational.score);
			Dao.activityPlayed(Relational.activity.value.id, true, Relational.score);
        }
    }
                
}
