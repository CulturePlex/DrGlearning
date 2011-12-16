Ext.define('DrGlearning.controller.activities.TemporalController', {
    extend: 'DrGlearning.controller.ActivityController',
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
	initializate: function(){
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
		this.activity=newActivity;
		view.down('component[id=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Temporal');
		console.log(newActivity.data);
		activityView.down('panel[customId=image]').setHtml('<img alt="imagen" src="'+newActivity.data.image+'" />');
		activityView.down('label').setHtml(newActivity.data.query);
		view.add(activityView);
	},
	before: function() {
		console.log(this.activity);
		if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward, function(){
				this.getController('DaoController').activityPlayed(this.activity.data.id,true,500);
				this.levelController.nextActivity();
			},this);
		}else
		{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				this.levelController.tolevel();
			},this);
		} 
	},
	after: function() {
		if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward, function(){
				this.getController('DaoController').activityPlayed(this.activity.data.id,true,500);
				this.levelController.nextActivity();
			},this);
		}else
		{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				console.log(this.getController('Careers'));
				this.levelController.tolevel();
			},this);
		} 
	}
});
