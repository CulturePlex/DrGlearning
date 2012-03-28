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
 	       	indicator: true
    	});
		this.activity=newActivity;
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		activityView = Ext.create('DrGlearning.view.activities.Temporal');
		activityView.down('label').setHtml(newActivity.data.query);
		newActivity.getImage('image','image',activityView.down('panel'),this,view,activityView);
	},loadingImages:function(view,newActivity){
		activityView.show();
		view.add(activityView);
		Ext.Viewport.setMasked(false);
	},
	before: function() {
		console.log(this.activity);
		if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,100);
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
		if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,100);
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
