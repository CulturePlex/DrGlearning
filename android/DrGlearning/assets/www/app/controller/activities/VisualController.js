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
		view.down('component[customId=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Visual');
		console.log(newActivity.data);
		activityView.down('panel[customId=image]').setHtml('<img alt="imagen" src="'+newActivity.data.image+'" />');
		activityView.down('label[id=query]').setHtml(newActivity.data.query);
		
		console.log(newActivity.data);
		
		view.add(activityView);
		
		
		var time=newActivity.data.time;
		var increment=0;
		while(time>0)
		{
				
		var t=setTimeout("activityView.down('label[customId=time]').setHtml('"+time/1000+"s');",increment);
		increment=increment+1000;
		time=time-1000;
		}
		}
		
	
});
