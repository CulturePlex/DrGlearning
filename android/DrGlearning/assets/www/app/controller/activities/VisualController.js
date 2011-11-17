Ext.define('DrGlearning.controller.activities.VisualController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Geospatial'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.geospatial',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	updateActivity: function(view,newActivity) {
		view.down('component[id=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Visual');
		console.log(newActivity.data);
		activityView.down('panel[customId=image]').setHtml('<img alt="imagen" src="'+newActivity.data.image+'" />');
		activityView.down('title').setTitle(newActivity.data.query);
		view.add(activityView);
	},
});
