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
		   //Relational.playerEdgePath.push(newValue.raw.edgeType);
           //Loading.careersRequest($(this).val(),$("#select-knowledges").val());
        });

/*
	change: function (field, newValue, oldValue)
    {
        if (newValue.data.text !== blankOption) {
            option.hide();
            playerEdgePath.push(newValue.raw.edgeType);
            option = takeStep(newValue.data.value);
            refresh(option);
        }
    }

*/

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
		//Something for the help
        /*if (!Relational.activity.data.helpviewed) 
        {
            this.activity.data.helpviewe = true;
            this.activity.save();
            this.getApplication().getController('LevelController').helpAndQuery();
        }*/
		Relational.refreshConstraints();
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
				   //Alerting socre obtained
                   /* Ext.Msg.alert(i18n.gettext('Congratulations!'), i18n.translate('You got %d points!').fetch(graphNodes[pathPosition].score), function ()
                    {
                    
                    }, this);*/
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
/*Ext.create('Ext.form.Select', {
            scope: this,
            options: options,
            listeners: {
                change: function (field, newValue, oldValue)
                {
                    if (newValue.data.text !== blankOption) {
                        option.hide();
                        playerEdgePath.push(newValue.raw.edgeType);
                        option = takeStep(newValue.data.value);
                        refresh(option);
                    }
                }
            }
        });*/
    },
	refreshRel: function (option)
    {
        /*var scorePanel = Ext.create('Ext.Panel', {
            html: '<p>' + i18n.gettext("Score") + ": " + getPathScore() + '</p>'
        });
        var gamePanel = Ext.create('Ext.Panel', {
            padding: 10
        });
        activityView.down('container[customId=scorebar]').removeAll();
        getContraintsHTML();*/
		$('#nodesWalked').empty();
        for (var i = 0; i < Relational.playerPath.length; i++) {
            if (i !== 0) {
                var edgeText = '<p class="relational">' + Relational.playerEdgePath[i - 1] + '</p>';
                $('#nodesWalked').append(edgeText);
                /*var edge = Ext.create('Ext.Container', {
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [{
                        xtype: 'panel',
                        html: '<img height=25 src="resources/images/arrowdown.png">',
                        margin: '5px'
                    }, {
                        xtype: 'panel',
                        html: edgeText
                    }]
                });
                
                
                gamePanel.add(edge);*/
            }
            /*var node = Ext.create('Ext.Container', {
                layout: {
                    type: 'hbox',
                    align: 'middle'
                },
                items: [{
                    xtype: 'panel',
                    html: '<img height=25 src="resources/images/record.png">',
                    margin: '5px'
                }, {
                    xtype: 'panel',
                    html: getNodeHTML(playerPath[i])
                }]
            });
            
            gamePanel.add(node);*/
            $('#nodesWalked').append(Relational.getNodeHTML(Relational.playerPath[i]));
        }
        /*var endNode = Ext.create('Ext.Container', {
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'panel',
                html: '<img height=25 src="resources/images/speaker.png">',
                margin: '5px'
            }, {
                xtype: 'panel',
                html: getNodeHTML(pathGoal)
            }]
        });*/
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
        //gamePanel.add(button);
        //activityView.add(gamePanel);
        //activityView.show();
        //view.add(activityView);
        //var scroller = activityView.getScrollable().getScroller();
        //scroller.scrollBy(0, 58);
		Relational.getContraintsHTML();
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
            /*
             * If state of constraint has changed button has animation fade
             
            if (changed === true)
            {
                temp = {
                    xtype: 'button',
                    iconCls: icontype,
                    ui: uitype,
                    customId: i,
                    listeners: {
                        tap: showConstraint,
                        painted: function ()
                        {
                            Ext.Anim.run(this, 'fade', {out: false, duration: 500});
                            Ext.Anim.run(this, 'fade', {out: true, duration: 500, delay: 10});
                            Ext.Anim.run(this, 'fade', {out: false, duration: 500, delay: 1540});
                            Ext.Anim.run(this, 'fade', {out: true, duration: 500, delay: 2050});
                            Ext.Anim.run(this, 'fade', {out: false, duration: 500, delay: 2560});
                        }
                    }
                };
            }
            else
            {
                temp = {
                    xtype: 'button',
                    iconCls: icontype,
                    ui: uitype,
                    customId: i,
                    listeners: {
                        tap: showConstraint
                    }
                };
            }
            activityView.down('toolbar[customId=constraintsbar]').add(temp);*/
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
           
            if (changed === true)
            {
                temp = {
                    xtype: 'button',
                    iconCls: icontype,
                    ui: uitype,
                    customId: i,
                    listeners: {
                        tap: showConstraint,
                        painted: function ()
                        {
                            Ext.Anim.run(this, 'fade', {out: false, duration: 501});
                            Ext.Anim.run(this, 'fade', {out: true, duration: 501, delay: 20});
                            Ext.Anim.run(this, 'fade', {out: false, duration: 501, delay: 1550});
                            Ext.Anim.run(this, 'fade', {out: true, duration: 501, delay: 2060});
                            Ext.Anim.run(this, 'fade', {out: false, duration: 501, delay: 2570});
                        }
                    }
                };
            }
            else
            {
                temp = {
                    xtype: 'button',
                    iconCls: icontype,
                    ui: uitype,
                    customId: i,
                    listeners: {
                        tap: showConstraint
                    }
                };
            }
            activityView.down('toolbar[customId=constraintsbar]').add(temp);  */
        }
        
        //activityView.down('toolbar[customId=constraintsbar]').add({
        //    xtype: 'spacer'
        //});
        //var constraintsText = '</ul></p>';
        //return constraintsText;
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
