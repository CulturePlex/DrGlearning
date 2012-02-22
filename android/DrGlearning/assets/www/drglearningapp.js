Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : 'DrGlearning',
	views : [ 'Loading' ],
	controllers : [ 'LoadingController','GlobalSettingsController','DaoController','CareersListController'],
	models: ['Activity','Career','Level','OfflineScore','User'],
	stores: ['Activities','Careers','Levels','OfflineScores','Users'],
	autoCreateViewport : true,
	
    launch: function() {
        this.getController('LoadingController').onLaunch();
    }
});
