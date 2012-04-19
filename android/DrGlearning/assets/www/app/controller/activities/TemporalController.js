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
    	    message: i18n.gettext('Loading activity...'),
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
		this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);
		newActivity.getImage('image','image',activityView.down('[id=image]'),this,view,activityView,false);
	},
	loadingImages:function(view,activityView){
		activityView.show();
		view.add(activityView);
		Ext.Viewport.setMasked(false);
		if(!this.activity.data.help)
		{
			this.activity.data.help=true;
			this.activity.save();
			this.getApplication().getController('LevelController').helpAndQuery();
		}
	},
	before: function() {
		this.puntos=100;
		if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
			Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward+i18n.gettext("obtained score:")+this.puntos, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
			},this);
		}else
		{
			Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext('Oooh, it wasnt the correct answer'), function(){
				this.getApplication().getController('LevelController').tolevel();
			},this);
		} 
	},
	after: function() {
		this.puntos=100;
		if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
			Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward+i18n.gettext("obtained score:")+this.puntos, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
			},this);
		}else
		{
			Ext.Msg.alert(i18n.gettext('Wrong!'), i18n.gettext('Oooh, it wasnt the correct answer'), function(){
				this.getApplication().getController('LevelController').tolevel();
			},this);
		} 
	}
});