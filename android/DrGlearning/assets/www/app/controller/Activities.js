/**
 * @class DrGlearning.controller.Activities
 * @extends Ext.app.Controller
 *
 * Controller to manage Activities Menu and Logic.
 */
Ext.define('DrGlearning.controller.Activities', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.controller.DaoController','DrGlearning.controller.activities.GeospatialController','DrGlearning.controller.activities.TemporalController','DrGlearning.controller.activities.VisualController'],
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
    initializate: function(){
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
            }
		});
    },
 	tolevel: function(){
        if (this.getActivityframe()) {
            this.getActivityframe().hide();
        }
        var view1 = this.getLevelframe();
		this.updateLevel(this.getController('Careers').selectedcareer, this.selectedlevel);		
        view1.show();
    },
    tolevels: function(){
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        this.getController('Levels').tocareer();
    },
	updateLevel: function(newCareer,newLevel) {
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
		var flechaizqHtml=this.getController('Careers').flechaizqHtml;
		var flechaderHtml=this.getController('Careers').flechaderHtml;
		//var currentLevel = this.getController('DaoController').getCurrenLevel(this.selectedcareer.internalId);
		var currentActivity = this.getController('DaoController').getCurrenActivity(newCareer.data.id,newLevel);
		var startingIndex=0;
		for(var i=0;i<activities.length;i++)
		{
			var activity=activities.getAt(i);
			if(activity.data.id==currentActivity){
				startingIndex=i;
			}
			var iconoactivityHtml = "<div align='center' style='position:absolute;margin:0 auto 0 auto; width:70%;top:0;left:15%;'>" + activity.data.name + "</div>";
			if(activity.data.successful)
			{
				iconoactivityHtml = "<div align='center' style='position:absolute;margin:0 auto 0 auto;height:100%; width:70%;top:0;left:15%;background-color:#999999;'>" + activity.data.name + "<div bottom='0'>Score: " + activity.data.score + "<img src=resources/images/tick.png></div></div>";
			}
			if (i == 0) {
				if (i == activities.length - 1) {
					activitiescarousel.setItems({
						listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}

		                    }},
						html: iconoactivityHtml,
						name: 'a'
					});
				}else
				{
					activitiescarousel.setItems({
						listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}

		                    }},
						html: iconoactivityHtml + flechaderHtml,
						name: 'a'
					});
				}

			}else if(i == activities.length-1)
			{
				activitiescarousel.setItems({
					listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}

		                    }},
					html: flechaizqHtml + iconoactivityHtml,
					name: 'a'
				});
			}else
			{
				activitiescarousel.setItems({
					listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
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
			return record.data.level_type==this.selectedlevel && record.data.careerId==this.getController('Careers').selectedcareer.data.id ;
		},this);
		newActivity = temp.items[newActivityIndex];
		console.log(view);
		view.down('title[customId=title]').setTitle(newActivity.data.name);
		var activityView;
		console.log(newActivity.data.activity_type);
		if (newActivity.data.activity_type == 'geospatial') {
			if (navigator.network == undefined || navigator.network.connection.type == Connection.NONE) {
				Ext.Msg.alert('No Internet', 'There is not connection to Internet, you cant start this activity!', function(){
				this.getController('Careers').tolevel();
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
	nextActivity: function(){
		/*if(this.activityView!=null)
		{
			this.activityView.hide();
			this.activityView.destroy();
		}*/
		var currentLevel = this.getController('DaoController').getCurrenLevel(this.getController('Careers').selectedcareer.data.id);
		var currentActivity = this.getController('DaoController').getCurrenActivity(this.getController('Careers').selectedcareer.data.id,currentLevel);
		console.log(currentActivity);
		this.startActivity(currentActivity);
		
	}
});
