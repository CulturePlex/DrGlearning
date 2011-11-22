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
	updateActivity: function(view,newActivity) {
		view.down('component[id=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Temporal');
		console.log(newActivity.data);
		activityView.down('panel[customId=image]').setHtml('<img alt="imagen" src="'+newActivity.data.image+'" />');
		activityView.down('label').setHtml(newActivity.data.query);
		view.add(activityView);
	},
});
