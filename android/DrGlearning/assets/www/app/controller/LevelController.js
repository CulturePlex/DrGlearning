/**
 * @class DrGlearning.controller.Activities
 * @extends Ext.app.Controller
 *
 * Controller to manage Level Menu and Logic.
 */
Ext.define('DrGlearning.controller.LevelController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            levelframe: 'levelframe',
            activityframe: 'activityframe'
        }
    },
    activityView: null,
    carousel: null,
    currentActivity: null,
    /*
     * Initializate Controller.
     */
    init: function(){
        this.careersListController = this.getApplication().getController('CareersListController');
        this.careerController = this.getApplication().getController('CareerController');
        this.levelController = this.getApplication().getController('LevelController');
        var view = Ext.create('DrGlearning.view.ActivityFrame');
        view.hide();
        this.control({
            'button[id=help]': {
                tap: this.help
            },
			 '[customId=query_label]': {
                click: this.more
            },
            'button[id=backtolevels]': {
                tap: this.tolevels
            },
            'button[id=startActivity]': {
                tap: this.startActivity
            },
            'button[customId=backtolevel]': {
                tap: this.tolevel
            },
            '[customId=centro]': {
                tap: this.startActivity
            },
			'list[customId=activitiesList]': {
                itemtap: this.startActivity
            }
        });
    },
    tolevels: function(){
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        this.getApplication().getController('CareerController').tocareer();
    },
    updateLevel: function(newCareer, newLevel){
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: i18n.gettext('Loading level...'),
            indicator: true
            //html: "<img src='resources/images/activity_icons/visual.png'>",
        });
        Ext.create('DrGlearning.view.LevelFrame');
        levelController = this.getApplication().getController('LevelController');
        this.selectedlevel = newLevel;
        var view = this.getLevelframe();
		view.setListeners( {
                painted: function(){
                    Ext.Viewport.setMasked(false);
                }
            });
        var detail = view.down('leveldetail');
		var activitieslist=detail.down('list[customId=activitiesList]');
		var filesImgs=["iletratumB.png","primaryB.png","secondaryB.png","highschoolB.png","collegeB.png","masterB.png","PhDB.png","post-docB.png","professorB.png","emeritusB.png"];
		activitieslist.setStyle( {
			            backgroundImage: 'url(resources/images/level_icons/'+filesImgs[newLevel-1]+')',
			            backgroundRepeat: 'no-repeat',
			            backgroundPosition: 'center',
						backgroundFilter: 'alpha(opacity=60)'
			});
		activitieslist.refresh();
        var level = Ext.getStore('Levels').getAt(newLevel - 1);
		Ext.getStore('Activities').sort('level_order');
		//Ext.getStore('Activities').sort('successful');
		Ext.getStore('Activities').clearFilter();
		Ext.getStore('Activities').filter('careerId',newCareer.data.id);
		Ext.getStore('Activities').filter({filterFn: function(item) { return item.data.level_type == newLevel; }});
		console.log(Ext.getStore('Activities'));
        view.down('title[id=title]').setTitle(newCareer.data.name);
		
		
        view.show();
        if (typeof(MathJax) !== "undefined") {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    },
    
    getActivityHtml: function(activityData){
        var html = "<div id='centro' align='middle'><p align='top'>" + activityData.name + "</p><a href= 'javascript:levelController.startActivity();'><img src='resources/images/activity_icons/" + activityData.activity_type + ".png' align='bottom'></a></div>";
        console.log(activityData.successful);
        if (activityData.successful == true) {
            html = "<div id='centro' align='middle'><p align='top'>" + activityData.name + "</p><a href= 'javascript:levelController.startActivity();'><img src='resources/images/activity_icons/" + activityData.activity_type + ".png' align='bottom'></a></div><div bottom='0' align='center'>Score: " + activityData.score + "<img  height='30px' src=resources/images/tick.png></div>";
        }
        return html;
        
    },
	startActivity: function(list, itemIndex, item, activity,e){
        this.updateActivity(activity);
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
    
    },
    
    updateActivity: function(newActivity){
        console.log(this);
        this.currentActivity = newActivity;
        Ext.create('DrGlearning.view.ActivityFrame');
        var view = this.getActivityframe();
        Ext.ComponentQuery.query('title[customId=title]')[0].setTitle(newActivity.data.name);
        var activityView;
        if (newActivity.data.activity_type == 'geospatial') {
           /* if (navigator.network == undefined || navigator.network.connection.type == Connection.NONE) {
             Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('There is not connection to Internet, you cant start this activity!'), function(){
             this.tolevel();
             }, this);
             }else{*/
            	this.getApplication().getController('activities.GeospatialController').updateActivity(view, newActivity);
            //}
        }
        else 
            if (newActivity.data.activity_type == 'visual') {
                this.getApplication().getController('activities.VisualController').updateActivity(view, newActivity);
            }
            else 
                if (newActivity.data.activity_type == 'relational') {
                    console.log(newActivity.data);
                    this.getApplication().getController('activities.RelationalController').updateActivity(view, newActivity);
                }
                else 
                    if (newActivity.data.activity_type == 'temporal') {
                        this.getApplication().getController('activities.TemporalController').updateActivity(view, newActivity);
                    }
                    else 
                        if (newActivity.data.activity_type == 'linguistic') {
                            this.getApplication().getController('activities.LinguisticController').updateActivity(view, newActivity);
                        }
                        else 
                            if (newActivity.data.activity_type == 'quiz') {
                                this.getApplication().getController('activities.QuizController').updateActivity(view, newActivity);
                            }
        view.show();
    },
    nextActivity: function(prevLevel){
        if (this.activityView) {
            this.activityView.hide();
        }
        
        var currentLevel = this.getApplication().getController('DaoController').getCurrenLevel(this.getApplication().getController('CareersListController').selectedcareer.data.id);
        var prevLevelString = Ext.getStore('Levels').getAt(prevLevel - 1).data.name;
		if (currentLevel != -1) {
			var currentLevelString = Ext.getStore('Levels').getAt(currentLevel - 1).data.name;
		}else
		{
				var currentLevelString = 'Error';
		}
        console.log(currentLevel);
        console.log(prevLevel);
        var currentActivity = this.getApplication().getController('DaoController').getCurrenActivity(this.getApplication().getController('CareersListController').selectedcareer.data.id, parseInt(prevLevel));
        if (currentActivity.data.successful == false) {
            this.updateActivity(currentActivity);
        }
        else {
            if (currentLevel == prevLevel) {
                if (this.getLevelframe()) {
                    this.getLevelframe().hide();
                }
                this.getApplication().getController('CareersListController').index();
                this.getActivityframe().hide();
                Ext.Msg.alert(i18n.gettext('Congrats!'), i18n.gettext('You have complete the ') + prevLevelString + i18n.gettext(' level! It was the last Level, you have finished this career!'), function(){}, this);;
            }
            else {
                this.getApplication().getController('CareerController').updateCareer(this.getApplication().getController('CareersListController').selectedcareer);
                this.getLevelframe().hide();
                this.getActivityframe().hide();
                if (currentLevel != -1) {
					
                    Ext.Msg.alert(i18n.gettext('Congrats!'), i18n.gettext('You have complete the ') + prevLevelString +  i18n.gettext(' level! Next Level: ') + currentLevelString , function(){}, this);
                }
                else {
                   Ext.Msg.alert(i18n.gettext('Congrats!'), i18n.gettext('You have complete the ') + prevLevelString + i18n.gettext(' level! It was the last Level, you have finished this career!'), function(){}, this);
                }
            }
        }
    
    },
    tolevel: function(){
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Loading level...',
            indicator: true
            //html: "<img src='resources/images/activity_icons/visual.png'>",
        }); 
        if (this.getActivityframe()) {
            this.getActivityframe().hide();
        }
        this.getApplication().getController('activities.VisualController').stop();
        this.getApplication().getController('activities.QuizController').stop();
        var view1 = this.getLevelframe();
        this.updateLevel(this.getApplication().getController('CareersListController').selectedcareer, this.getApplication().getController('LevelController').selectedlevel);
		
        view1.show();
    },
    help: function(){
        var text = "help!";
        if (this.currentActivity.data.activity_type == 'linguistic') {
            text = i18n.gettext("You should to guess a sentence with help of the image and the tip text, you can unlock letters in the hide tip and parts of the image");
            Ext.Msg.alert('Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'geospatial') {
            text = i18n.gettext("You should find the correct location in the map");
            Ext.Msg.alert('Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'quiz') {
            text = i18n.gettext("You have to choose the correct option");
            Ext.Msg.alert('Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'relational') {
            text = i18n.gettext("You should go from one consept to another according with the constraints");
            Ext.Msg.alert('Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'temporal') {
            text = i18n.gettext("You should to guess if the event in the text was before or after the event in the image");
            Ext.Msg.alert('Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'visual') {
            text = i18n.gettext("Look at the image and answer the question!");
            this.getApplication().getController('activities.VisualController').stopNotClear();
            Ext.Msg.alert(i18n.gettext('Help'), text, function(){
                this.getApplication().getController('activities.VisualController').restart()
            }, this);
        }
    },
    more: function(that){
        console.log(that);
        var text = that.currentActivity.data.query;
        Ext.Msg.alert(i18n.gettext('Question'), text, function(){
        }, that);
        
    },
	helpAndQuery: function(){
		var text = this.currentActivity.data.query;
        if (this.currentActivity.data.activity_type == 'linguistic') {
			text += " <br>  <br>";
			text += i18n.gettext("You should to guess a sentence with help of the image and the tip text, you can unlock letters in the hide tip and parts of the image");
            Ext.Msg.alert('Question and Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'geospatial') {
			text += " <br>  <br>";
            text += i18n.gettext("You should find the correct location in the map");
            Ext.Msg.alert('Question and Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'quiz') {
            text += " <br>  <br>";
            text += i18n.gettext("You have to choose the correct option");
            Ext.Msg.alert('Question and Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'relational') {
            text += " <br>  <br>";
            text += i18n.gettext("You should go from one consept to another according with the constraints");
            Ext.Msg.alert('Question and Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'temporal') {
            text += " <br>  <br>";
            text += i18n.gettext("You should to guess if the event in the text was before or after the event in the image");
            Ext.Msg.alert('Question and Help', text, function(){
            }, this);
        }
        if (this.currentActivity.data.activity_type == 'visual') {
            text += " <br>  <br>";
            text += i18n.gettext("Look at the image and answer the question!");
            this.getApplication().getController('activities.VisualController').stopNotClear();
            Ext.Msg.alert(i18n.gettext('Question and Help'), text, function(){
                this.getApplication().getController('activities.VisualController').restart()
            }, this);
        }
		
	}
});
