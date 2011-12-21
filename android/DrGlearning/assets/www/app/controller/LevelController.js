/**
 * @class DrGlearning.controller.Activities
 * @extends Ext.app.Controller
 *
 * Controller to manage Level Menu and Logic.
 */
Ext.define('DrGlearning.controller.LevelController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.controller.DaoController','DrGlearning.controller.activities.GeospatialController','DrGlearning.controller.activities.TemporalController','DrGlearning.controller.activities.VisualController','DrGlearning.controller.activities.RelationalController'],
    views: ['LevelFrame','ActivityFrame'],
    stores: ['Careers','Levels','Activities','Users'],
    refs: [{
        ref: 'levelframe',
        selector: 'levelframe',
        xtype: 'levelframe'
    }, {
        ref: 'activityframe',
        selector: 'activityframe',
        xtype: 'activityframe'
    }
	],
	activityView:null,
	/*
	 * Initializate Controller.
	 */
    init: function(){
		this.careersListController=this.getController('CareersListController');
		this.careerController=this.getController('CareerController');
		this.levelController=this.getController('LevelController');
		this.getLevelFrameView().create();
       	this.control({
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
            }
			
			
		});
    },
    tolevels: function(){
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        this.careerController.tocareer();
    },
	updateLevel: function(newCareer,newLevel) {
		levelController=this.getController('LevelController');
		this.selectedlevel=newLevel;
		var view = this.getLevelframe();
		var detail= view.down('leveldetail');
		var description = detail.down('leveldescription');
		var level=this.getLevelsStore().getAt(newLevel-1);
		description.setHtml('<b>'+level.data.name+' Level: </b>'+level.data.description+'<div style="position:absolute;margin:0 auto 0 auto; width:100%;bottom:50%;">Activities:</div>');
		var activitiescarousel = detail.down('carousel');
		var activities = this.getController('DaoController').getActivitiesByLevel(''+newCareer.data.id,''+newLevel);
		activitiescarousel.destroy();
		activitiescarousel=Ext.create('Ext.Carousel', {
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
    	});
		var flechaizqHtml=this.careersListController.flechaizqHtml;
		var flechaderHtml=this.careersListController.flechaderHtml;
		var currentActivity = this.getController('DaoController').getCurrenActivity(newCareer.data.id,newLevel);
		var startingIndex=0;
		for(var i=0;i<activities.length;i++)
		{
			var activity=activities.getAt(i);
			if(activity.data.id==currentActivity){
				startingIndex=i;
			}
			var iconoactivityHtml = "<div customId='centro' align='center' style='position:absolute;margin:0 auto 0 auto; width:70%;top:0;left:15%;'>" + activity.data.name + "</div>";
			if(activity.data.successful)
			{
				iconoactivityHtml = "<div customId='centro' align='center' style='position:absolute;margin:0 auto 0 auto;height:100%; width:70%;top:0;left:15%;background-color:#999999;'>" + activity.data.name + "<div bottom='0'>Score: " + activity.data.score + "<img src=resources/images/tick.png></div></div>";
			}
			if (i == 0) {
				if (i == activities.length - 1) {
					activitiescarousel.add({
						listeners: {
		                    tap: function(scope) {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								else if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								else
								{
									levelController.startActivity();						
								}

		                    }},
						html: iconoactivityHtml,
						name: 'a'
					});
				}else
				{
					activitiescarousel.add({
						listeners: {
		                    tap: function(scope) {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								else if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								else
								{
									levelController.startActivity();					
								}

		                    }},
						html: iconoactivityHtml + flechaderHtml,
						name: 'a'
					});
				}

			}else if(i == activities.length-1)
			{
				activitiescarousel.add({
					listeners: {
		                    tap: function(scope) {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								else if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								else
								{
									levelController.startActivity();						
								}

		                    }},
					html: flechaizqHtml + iconoactivityHtml,
					name: 'a'
				});
			}else
			{
				activitiescarousel.add({
					listeners: {
		                    tap: function(scope) {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								else if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								else 
								{
									levelController.startActivity();						
								}

		                    }},
					html: flechaizqHtml + iconoactivityHtml + flechaderHtml,
					name: 'a'
				});
			}
		}
		console.log(currentActivity);
		console.log(activitiescarousel);
		activitiescarousel.setActiveItem(startingIndex);
		detail.add(activitiescarousel);
		view.down('title[id=title]').setTitle(newCareer.data.name);
		view.show();
    },
    startActivity: function(){
		var view1 = this.getLevelframe();
		var detail= view1.down('leveldetail');
		var activitiescarousel = detail.down('carousel');
        this.getActivityFrameView().create();
        var view = this.getActivityframe();
        this.updateActivity(activitiescarousel.getActiveIndex());
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
		this.activityView=view;
        view.show();
    },
	updateActivity: function(newActivityIndex) {
		var view = this.getActivityframe();
		var temp = this.getActivitiesStore().queryBy(function(record) {
			return record.data.level_type==this.selectedlevel && record.data.careerId==this.careersListController.selectedcareer.data.id ;
		},this);
		newActivity = temp.items[newActivityIndex];
		console.log(view);
		view.down('title[customId=title]').setTitle(newActivity.data.name);
		var activityView;
		console.log(newActivity.data.activity_type);
		if (newActivity.data.activity_type == 'geospatial') {
			if (navigator.network == undefined || navigator.network.connection.type == Connection.NONE) {
				Ext.Msg.alert('No Internet', 'There is not connection to Internet, you cant start this activity!', function(){
				this.careersListController.tolevel();
			}, this);
			}else{
				this.getController('activities.GeospatialController').updateActivity(view, newActivity);
			}
		}else if (newActivity.data.activity_type == 'visual') {
			this.getController('activities.VisualController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'relational'){
			this.getController('activities.RelationalController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'temporal'){
			this.getController('activities.TemporalController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'linguistic'){
			this.getController('activities.LinguisticController').updateActivity(view,newActivity);
		}
	},
	nextActivity: function(prevLevel){
		/*if(this.activityView!=null)
		{
			this.activityView.hide();
			this.activityView.destroy();
		}*/
		
		var currentLevel = this.getController('DaoController').getCurrenLevel(this.careersListController.selectedcareer.data.id);
		console.log('prevlevel: '+prevLevel);
		var prevLevelString = this.getLevelsStore().getAt(prevLevel-1).data.name;
		console.log('prevlevelString: '+prevLevelString);
		console.log('currenlevel: '+currentLevel);
		//console.log(currentLevel);
		if(currentLevel==prevLevel)
		{
			var currentActivity = this.getController('DaoController').getCurrenActivity(this.careersListController.selectedcareer.data.id,currentLevel);
			this.startActivity(currentActivity);
		}
		else
		{
			this.careerController.updateCareer(this.careersListController.selectedcareer);
			this.getLevelframe().hide();
			this.getActivityframe().hide();
			console.log('hola');
			setTimeout("Ext.Msg.alert('Congrats!', 'You have complete the "+prevLevelString+" level!', function(){}, this);",50);
				
		}
		//console.log(currentActivity);
		
	},
	tolevel: function(){
        if (this.activityView) {
            this.activityView.hide();
        }
        var view1 = this.getLevelframe();
		this.updateLevel(this.careersListController.selectedcareer, this.levelController.selectedlevel);		
        view1.show();
    }
});
