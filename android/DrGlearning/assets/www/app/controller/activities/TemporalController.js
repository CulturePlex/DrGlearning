Ext.define('DrGlearning.controller.activities.TemporalController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Temporal'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.temporal',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	activity:null,
	puntos:null,
	init: function(){
		this.levelController = this.getApplication().getController('LevelController');
		this.control({
			'button[customId=after]': {
				tap: this.after
			},
			'button[customId=before]': {
				tap: this.before
			}
		});
	},
	updateActivity: function(view,newActivity) {
		Ext.Viewport.setMasked({
    	    xtype: 'loadmask',
    	    message: 'Loading activity...',
 	       	indicator: true,
			//html: "<img src='resources/images/activity_icons/temporal.png'>",
    	});
		this.activity=newActivity;
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		activityView = Ext.create('DrGlearning.view.activities.Temporal');
		console.log(newActivity.data);
		this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);
		newActivity.getImage('image','image',activityView.down('[id=image]'),this,view,activityView,false);
		console.log(activityView.down('[id=image]'));
	},
	loadingImages:function(view,activityView){
		activityView.show();
		view.add(activityView);
		Ext.Viewport.setMasked(false);
		if(!this.helpFlag)
		{
			this.getApplication().getController('LevelController').help();
			this.helpFlag=true;
		}
	},
	before: function() {
		this.puntos=100;
		console.log(this.activity);
		if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward+" obtained score: "+this.puntos, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
			},this);
		}else
		{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				this.getApplication().getController('LevelController').tolevel();
			},this);
		} 
	},
	after: function() {
		this.puntos=100;
		if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward+" obtained score: "+this.puntos, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				console.log('ola');
				this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
			},this);
		}else
		{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				this.getApplication().getController('LevelController').tolevel();
			},this);
		} 
	}
});