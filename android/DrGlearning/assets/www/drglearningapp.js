Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : 'DrGlearning',
	views : [ 'Loading','CareerFrame','Main', ],
	controllers : [ 'LoadingController','GlobalSettingsController','DaoController','CareersListController','CareerController','LevelController'],
	models: ['Activity','Career','Level','OfflineScore','User'],
	stores: ['Activities','Careers','Levels','OfflineScores','Users'],
	autoCreateViewport : true,
	
    launch: function() {
        this.getController('LoadingController').onLaunch();
    }
});
