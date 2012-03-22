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
    		activityframe: 'activityframe',
        }
    },
    activityView:null,
	carousel:null,
	/*
	 * Initializate Controller.
	 */
    init: function(){
		this.careersListController=this.getApplication().getController('CareersListController');
		this.careerController=this.getApplication().getController('CareerController');
		this.levelController=this.getApplication().getController('LevelController');
		var view = Ext.create('DrGlearning.view.ActivityFrame');
		view.hide();
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
		console.log('olas');
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        this.getApplication().getController('CareerController').tocareer();
    },
	updateLevel: function(newCareer,newLevel) {
		Ext.create('DrGlearning.view.LevelFrame');
		levelController=this.getApplication().getController('LevelController');
		this.selectedlevel=newLevel;
		console.log(this);
		
		var view = this.getLevelframe();
		var detail= view.down('leveldetail');
		var description = detail.down('leveldescription');
		var level=Ext.getStore('Levels').getAt(newLevel-1);
		description.setHtml('<p>'+level.data.name+' Level: '+level.data.description+'</p>');
		var activitiescarousel = detail.down('carousel');
		var activities = this.getApplication().getController('DaoController').getActivitiesByLevel(''+newCareer.data.id,''+newLevel);
		activitiescarousel.removeAll();
		this.carousel=activitiescarousel;
		var flechaizqHtml="<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><a href= 'javascript:levelController.carousel.previous();'><img src='resources/images/flechaizq.png' alt='flecha'></a></div>";
		var flechaderHtml="<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><a href= 'javascript:levelController.carousel.next();'><img src='resources/images/flecha.png' alt='flecha'></a></div>";
		var currentActivity = this.getApplication().getController('DaoController').getCurrenActivity(newCareer.data.id,newLevel).data.id;
		var startingIndex=0;
		
		for(var i=0;i<activities.length;i++)
		{
			var activity=activities.getAt(i);
			if(activity.data.id==currentActivity){
				startingIndex=i;
			}
			var iconoactivityHtml = this.getActivityHtml(activity.data);
			//var iconoactivityHtml = "<div customId='centro' align='center' style='position:absolute;margin:0 auto 0 auto; width:70%;top:0;left:15%;'>" + activity.data.name + activityIconHtml</div>";
			/*if(activity.data.successful)
			{
				iconoactivityHtml = "<div customId='centro' align='center' style='position:absolute;margin:0 auto 0 auto;height:100%; width:70%;top:0;left:15%;background-color:#999999;'>" + activity.data.name + "<div bottom='0'>Score: " + activity.data.score + "<img src=resources/images/tick.png></div></div>";
			}*/
			if (i == 0) {
				if (i == activities.length - 1) {
					activitiescarousel.add({
						html: iconoactivityHtml,
						name: 'a',
						myId: activity.data.id
					});
				}else
				{
					activitiescarousel.add({
						html: iconoactivityHtml + flechaderHtml,
						name: 'a',
						myId: activity.data.id
					});
				}

			}else if(i == activities.length-1)
			{
				activitiescarousel.add({
					html: flechaizqHtml + iconoactivityHtml,
					name: 'a',
					myId: activity.data.id
				});
			}else
			{
				activitiescarousel.add({
					html: flechaizqHtml + iconoactivityHtml + flechaderHtml,
					name: 'a',
					myId: activity.data.id
				});
			}
		}
		activitiescarousel.setActiveItem(startingIndex);
		detail.add(activitiescarousel);
		view.down('title[id=title]').setTitle(newCareer.data.name);
		view.show();
    },
	
	getActivityHtml: function(activityData)
	{
		var html= "<div id='centro' align='middle'><p align='top'>"+activityData.name+"</p><a href= 'javascript:levelController.startActivity();'><img src='resources/images/activity_icons/"+activityData.activity_type+".png' align='bottom'></a></div>";
		console.log(activityData.successful);
		if(activityData.successful==true)
		{
			html = "<div id='centro' align='middle'><p align='top'>"+activityData.name+"</p><a href= 'javascript:levelController.startActivity();'><img src='resources/images/activity_icons/"+activityData.activity_type+".png' align='bottom'></a></div><div bottom='0' align='center'>Score: " + activityData.score + "<img  height='30px' src=resources/images/tick.png></div>";
		}
		return html;
		
	},
	
    startActivity: function(){
		
		var view1 = this.getLevelframe();
		var detail= view1.down('leveldetail');
		var activitiescarousel = detail.down('carousel');
		console.log(activitiescarousel.getActiveItem());
        //this.getActivityFrameView().create();
		var temp = Ext.getStore('Activities').queryBy(function(record) {
			return record.data.id == activitiescarousel.getActiveItem().config.myId;
		},this);
		console.log(temp);
		newActivity = temp.items[0];
		//console.log('no era un numero');
		this.updateActivity(newActivity);
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
		//this.activityView=view;
   		
    },
	
	updateActivity: function(newActivity) {
		Ext.create('DrGlearning.view.ActivityFrame');
		var view = this.getActivityframe();
		Ext.ComponentQuery.query('title[customId=title]')[0].setTitle(newActivity.data.name);
		var activityView;
		if (newActivity.data.activity_type == 'geospatial') {
			/*if (navigator.network == undefined || navigator.network.connection.type == Connection.NONE) {
				Ext.Msg.alert('No Internet', 'There is not connection to Internet, you cant start this activity!', function(){
				this.careersListController.tolevel();
			}, this);
			}else{*/
				this.getApplication().getController('activities.GeospatialController').updateActivity(view, newActivity);
			//}
		}else if (newActivity.data.activity_type == 'visual') {
			this.getApplication().getController('activities.VisualController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'relational'){
			console.log(newActivity.data);
			this.getApplication().getController('activities.RelationalController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'temporal'){
			this.getApplication().getController('activities.TemporalController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'linguistic'){
			this.getApplication().getController('activities.LinguisticController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'quiz'){
			this.getApplication().getController('activities.QuizController').updateActivity(view,newActivity);
		}
		view.show();
	},
	nextActivity: function(prevLevel){
		if(this.activityView)
		{
			this.activityView.hide();
		}
		
		var currentLevel = this.getApplication().getController('DaoController').getCurrenLevel(this.getApplication().getController('CareersListController').selectedcareer.data.id);
		var prevLevelString = Ext.getStore('Levels').getAt(prevLevel-1).data.name;
		var currentLevelString = Ext.getStore('Levels').getAt(currentLevel-1).data.name;
		console.log(currentLevel);
		console.log(prevLevel);
		var currentActivity = this.getApplication().getController('DaoController').getCurrenActivity(this.getApplication().getController('CareersListController').selectedcareer.data.id,parseInt(prevLevel));
		if(currentActivity.data.successful == false)
		{
			this.updateActivity(currentActivity);
		}else
		{
			if (currentLevel == prevLevel) 
			{
				if (this.getLevelframe()) {
		            this.getLevelframe().hide();
		        }
		        this.getApplication().getController('CareersListController').index();
				this.getActivityframe().hide();
				setTimeout("Ext.Msg.alert('Congrats!', 'You have complete the " + prevLevelString + " level! It was the last Level, you have finished this career!', function(){}, this);", 50);
			}else
			{
				this.getApplication().getController('CareerController').updateCareer(this.getApplication().getController('CareersListController').selectedcareer);
				this.getLevelframe().hide();
				this.getActivityframe().hide();
				if (currentLevel != 1) {
					setTimeout("Ext.Msg.alert('Congrats!', 'You have complete the " + prevLevelString + " level! Next Level: " + currentLevelString + "', function(){}, this);", 50);
				}else
				{
					setTimeout("Ext.Msg.alert('Congrats!', 'You have complete the " + prevLevelString + " level! It was the last Level, you have finished this career!', function(){}, this);", 50);
				}
			}
		}

		//console.log(currentActivity);
		
	},
	tolevel: function(){
        if (this.getActivityframe()) {
            this.getActivityframe().hide();
        }
		this.getApplication().getController('activities.VisualController').stop();
		this.getApplication().getController('activities.QuizController').stop();
        var view1 = this.getLevelframe();
		this.updateLevel(this.getApplication().getController('CareersListController').selectedcareer, this.getApplication().getController('LevelController').selectedlevel);		
        view1.show();
    }
});
