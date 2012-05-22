//Global Words to skip JSLint validation//
/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global Ext i18n google GeoJSON activityView MathJax clearInterval event*/

Ext.define('DrGlearning.controller.activities.RelationalController', {
    extend: 'Ext.app.Controller',
    config: {
        fullscreen: true,
        refs: {
            relational: 'activities.relational',
            activityframe: 'activityframe'
        }
    },
    activityView: null,
    activity: null,
    updateActivity: function (view, newActivity)
    {
        this.activity = newActivity;
        view.down('component[customId=activity]').destroy();
        var activityView = Ext.create('DrGlearning.view.activities.Relational');
        this.getApplication().getController('ActivityController').addQueryAndButtons(activityView, newActivity);
        
        var daocontroller = this.getApplication().getController('DaoController');
        var careerscontroller = this.getApplication().getController('CareersListController');
        var activitiescontroller = this.getApplication().getController('LevelController');
        var blankOption = "Choose";
        var playerPath = [];
        var playerEdgePath = [];
        var pathStart, pathGoal, pathPosition;
        var option;
        var allConstraintsPassed = false;
        var score = 20;
        
        var verboseOperator = {
            lt: "less than",
            lte: "less or equal than",
            gt: "greater than",
            get: "greater or equal than",
            eq: "equals to",
            neq: "different to"
        };
        
        //Import graph nodes and edges from database
        var graphNodes = newActivity.data.graph_nodes;
        var graphEdges = newActivity.data.graph_edges;
        var constraints = newActivity.data.constraints;
        var path_limit = newActivity.data.path_limit;
        
        /** This function receives a nodeName and searches into edges
         * data for all the related nodes. It returns a Sencha field.Select
         * object with all the options available */
        function createSelectFromNode(nodeName)
        {
            var edge;
            var written = [];
            var tipo = "error";
            blankOption = "Choose";
            var nodo;
            for (var i = 0; i < graphEdges.length; i++) {
                edge = graphEdges[i];
                if (edge.target === nodeName && edge.inverse !== undefined && edge.inverse !== '' && playerPath.indexOf(edge.source) === -1) {
                    for (nodo in graphNodes) {
                        if (nodo === edge.source) {
                            tipo = graphNodes[nodo].type;
                        }
                    }
                    if (blankOption === "Choose") {
                        if (written.indexOf(tipo) === -1) {
                            blankOption += " " + tipo.toLowerCase();
                        }
                    }
                    else {
                        if (written.indexOf(tipo) === -1) {
                            blankOption += ", " + tipo.toLowerCase();
                        }
                    }
                    written.push(tipo);
                    
                }
                if (edge.source === nodeName && playerPath.indexOf(edge.target) === -1) {
                    for (nodo in graphNodes) {
                        if (nodo === edge.target) {
                            tipo = graphNodes[nodo].type;
                        }
                    }
                    if (blankOption === "Choose") {
                        if (written.indexOf(tipo) === -1) {
                            blankOption += " " + tipo.toLowerCase();
                        }
                    }
                    else {
                        if (written.indexOf(tipo) === -1) {
                            blankOption += ", " + tipo.toLowerCase();
                        }
                    }
                    if (written.indexOf(tipo) === -1) {
                    
                        written.push(tipo);
                    }
                }
            }
            var options = [{
                text: blankOption
            }];
            for (i = 0; i < graphEdges.length; i++) {
                edge = graphEdges[i];
                if (edge.target === nodeName && edge.inverse !== undefined && edge.inverse !== '' && playerPath.indexOf(edge.source) === -1) {
                    options.push({
                        text: edge.inverse + ' ' + edge.source,
                        value: edge.source,
                        edgeType: edge.inverse,
                        width: '100%'
                    });
                }
                else 
                if (edge.source === nodeName && playerPath.indexOf(edge.target) === -1) 
                {
                    options.push({
                            text: edge.type + ' ' + edge.target,
                            value: edge.target,
                            edgeType: edge.type
                        });
                }
            }
            return Ext.create('Ext.form.Select', {
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
            });
        }
        
        /**
         * Given a step adds it to the path. If the step is the goal node
         * and all the constraints are met, the game is successfully over.
         * Otherwise, it pushes the step into the players path and queries
         * all the posible next steps to the edges data */
        function takeStep(step)
        {
        
            pathPosition = step;
            //TODO Add constraints
            if (step === pathGoal) 
            {
                successfulGame(this);
                return null;
            }
            else {
                playerPath.push(step);
                if (graphNodes[pathPosition] !== undefined) {
                    if (graphNodes[pathPosition].score !== undefined && graphNodes[pathPosition].score > 0) {
                        score += parseInt(graphNodes[pathPosition].score, 10);
                        Ext.Msg.alert(i18n.gettext('Congratulations!'), 'You get ' + graphNodes[pathPosition].score + ' points!', function ()
                        {
                        
                        }, this);
                    }
                }
                return createSelectFromNode(pathPosition);
            }
        }
        
        function getNodeHTML(nodeName)
        {
            return '<p class="relational">' + nodeName + ' (' + graphNodes[nodeName].type + ')' + '</p>';
        }
        
        function constraintPassed(constraint)
        {
            var counted = [];
            var elementCount = 0;
            var constraintValue = parseInt(constraint.value, 10);
            for (var i = 0; i < playerPath.length; i++) {
                if (constraint.type === graphNodes[playerPath[i]].type && counted.indexOf(playerPath[i]) === -1) {
                    counted.push(playerPath[i]);
                    elementCount++;
                }
            }
            switch (constraint.operator) {
            case "eq":
                return (elementCount === constraintValue);
            case "neq":
                return (elementCount !== constraintValue);
            case "let":
                return (elementCount <= constraintValue);
            case "get":
                return (elementCount >= constraintValue);
            case "lt":
                return (elementCount < constraintValue);
            case "gt":
                return (elementCount > constraintValue);
            default:
                return false;
            }
        }
        var constraintsTextNew = [];
        var constraintState = [];
        var constraintBoolean = [];
        function getContraintsHTML()
        {
            var constraintClass;
            var icontype;
            var uitype;
            var oldStateTemp;
            var temp;
            var changed;
            allConstraintsPassed = true;
            activityView.down('toolbar[customId=constraintsbar]').removeAll();
            activityView.down('toolbar[customId=constraintsbar]').add({
                xtype: 'spacer'
            });
            for (var i = 0; i < constraints.length; i++) {
                changed = false;
                constraintsTextNew[i] = "";
                constraintState[i] = "";
                
                if (constraintPassed(constraints[i])) {
                    setTimeout("console.log("+i+");",500);
                    constraintClass = "relational-constraint-passed";
                    icontype = 'star';
                    uitype = 'confirm';
                    console.log(constraintBoolean[i]);
                    if(constraintBoolean[i] !== true && constraintBoolean[i]!== undefined)
                    {
                        changed=true;
                    }
                    constraintState[i] = i18n.gettext('Constraint Passed');
                    constraintBoolean[i] = true;
                }
                else {
                    setTimeout("console.log("+i+");",500);
                    constraintClass = "relational-constraints";
                    allConstraintsPassed = false;
                    icontype = 'delete';
                    uitype = 'decline';
                    console.log(constraintBoolean[i]);
                    if(constraintBoolean[i] !== false && constraintBoolean[i]!== undefined)
                    {
                        changed=true;
                    }
                    constraintState[i] = i18n.gettext('Constraint Not Passed Yet');
                    constraintBoolean[i] = false;
                }
                constraintsTextNew[i] += i18n.gettext('The number of ');
                constraintsTextNew[i] += constraints[i].type + ' should be ';
                constraintsTextNew[i] += verboseOperator[constraints[i].operator] + ' ';
                constraintsTextNew[i] += constraints[i].value;
                /*
                 * If state of constraint has changed button has animation fade
                 */
                if(changed===true)
                {
                    temp = {
                        xtype: 'button',
                        iconCls: icontype,
                        ui: uitype,
                        customId: i,
                        listeners: {
                            tap: showConstraint,
                            painted: function()
                                  {
                                      Ext.Anim.run(this, 'fade', {out:true, duration:0});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:1000});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:1500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:2000});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:2500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:3000});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:3500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:4000});
                                  }
                        },
                        
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
                            tap: showConstraint,
                        },
                        
                    };
                }
                activityView.down('toolbar[customId=constraintsbar]').add(temp);
            }
            i++;
            if (path_limit > 0)
            {
                changed = false;
                constraintsTextNew[i] = "";
                constraintState[i] = "";
                if (playerPath.length <= path_limit) {
                    constraintClass = "relational-constraint-passed";
                    icontype = 'star';
                    uitype = 'confirm';
                    if(constraintBoolean[i] === false)
                    {
                        changed=true;
                    }
                    constraintState[i] = i18n.gettext('Constraint Passed');
                    constraintBoolean[i] = true;
                }
                else {
                    constraintClass = "relational-constraints";
                    allConstraintsPassed = false;
                    icontype = 'delete';
                    uitype = 'decline';
                    if(constraintBoolean[i] === true)
                    {
                        changed=true;
                    }
                    constraintState[i] = i18n.gettext('Constraint Not Passed Yet');
                    constraintBoolean[i] = false;
                }
                constraintsTextNew[i] += i18n.gettext('The number of ');
                constraintsTextNew[i] += i18n.gettext('steps ') + ' should be ';
                constraintsTextNew[i] += i18n.gettext('less than') + ' ' + path_limit;
                /*
                 * If state of constraint has changed button has animation fade
                 */
                if(changed===true)
                {
                    temp = {
                        xtype: 'button',
                        iconCls: icontype,
                        ui: uitype,
                        customId: i,
                        listeners: {
                            tap: showConstraint,
                            painted: function()
                                  {
                                      Ext.Anim.run(this, 'fade', {out:true, duration:0});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:1000});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:1500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:2000});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:2500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:3000});
                                      Ext.Anim.run(this, 'fade', {out:true, duration:500, delay:3500});
                                      Ext.Anim.run(this, 'fade', {out:false, duration:500, delay:4000});
                                  }
                        },
                        
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
                            tap: showConstraint,
                        },
                        
                    };
                }
                activityView.down('toolbar[customId=constraintsbar]').add(temp);
            }
            
            activityView.down('toolbar[customId=constraintsbar]').add({
                xtype: 'spacer'
            });
            var constraintsText = '</ul></p>';
            return constraintsText;
        }
        /** Given the last step, it refreshes the user interface to mark the
         * actual walked path and next options available */
        function refresh(option)
        {
            activityView.removeAll();
            var scorePanel = Ext.create('Ext.Panel', {
                html: '<p>Score: ' + getPathScore() + '</p>'
            });
            var gamePanel = Ext.create('Ext.Panel', {
                padding: 10
            });
            activityView.down('container[customId=scorebar]').removeAll();
            getContraintsHTML();
            for (var i = 0; i < playerPath.length; i++) {
                if (i !== 0) {
                    var edgeText = '<p class="relational">' + playerEdgePath[i - 1] + '</p>';
                    
                    var edge = Ext.create('Ext.Container', {
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
                    
                    
                    gamePanel.add(edge);
                }
                var node = Ext.create('Ext.Container', {
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
                
                gamePanel.add(node);
            }
            var endNode = Ext.create('Ext.Container', {
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
            });
            var button = Ext.create('Ext.Button', {
                text: i18n.gettext('Undo'),
                handler: function ()
                {
                    stepBack();
                },
                scope: this
            });
            if (option)
            {
                if (option.getOptions().length > 1)
                {
                    gamePanel.add(option);    
                } else
                {
                    gamePanel.add({xtype: 'panel', html: "<div class='warning'>" + i18n.gettext('Sorry, from here you cannot reach ') + pathGoal + i18n.gettext('. Try undo.') + "<div>"});
                }
            }
            if (option)
            {
                if (option.getOptions().length > 1)
                {
                    gamePanel.add(endNode);
                }
            }
            gamePanel.add(button);
            activityView.add(gamePanel);
            activityView.show();
            view.add(activityView);
            var scroller = activityView.getScrollable().getScroller();
            scroller.scrollBy(0, 58);
        }
        
        
        function stepBack()
        {
            var previousStep;
            if (playerPath.length > 1) {
                previousStep = playerPath[playerPath.length - 2];
                playerPath.splice(playerPath.length - 2, 2);
                playerEdgePath.splice(playerEdgePath.length - 1, 1);
                if (option)
                {
                    option.hide();
                }
                option = takeStep(previousStep);
                refresh(option);
            }
        }
        
        function getPathScore()
        {
            var node;
            var newScore;
            for (var i = 0; i < playerPath.length; i++) {
                node = graphNodes[playerPath[i]];
                if (node !== undefined) {
                    if (node.score !== undefined) {
                        newScore = parseInt(node.score, 10);
                    }
                }
            }
            return newScore;
        }
        
        function successfulGame()
        {
            if (score > 100)
            {
                score = 100;
            }
            if (allConstraintsPassed) {
                Ext.Msg.alert(i18n.gettext('Right!'), newActivity.data.reward + ' ' + i18n.gettext("obtained score:") + score, function ()
                {
                    daocontroller.activityPlayed(newActivity.data.id, true, score);
                    activitiescontroller.nextActivity(newActivity.data.level_type);
                });
            }
        }
        
        function showConstraint(button)
        {

            Ext.Msg.alert(constraintState[button.config.customId], constraintsTextNew[button.config.customId], function ()
            {
            }, this);
        }
        
        
        //Set the initial step as the initial node and the goal
        for (var i in graphNodes) 
        {
            if (graphNodes[i].hasOwnProperty("start")) {
                pathStart = i;
            }
            else 
            if (graphNodes[i].hasOwnProperty("end")) {
                pathGoal = i;
            }
        }
        //Execute first step
        option = takeStep(pathStart);
        refresh(option);
        if (!this.activity.data.helpviewed) 
        {
            this.activity.data.helpviewe = true;
            this.activity.save();
            this.getApplication().getController('LevelController').helpAndQuery();
        }
    }
});
