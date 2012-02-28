Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : 'DrGlearning',
	views : [ 'Loading','CareerFrame','Main','LevelFrame', 'ActivityFrame','activities.Geospatial', 'activities.Visual', 'activities.Linguistic', 'activities.Temporal' ],
	controllers : [ 'LoadingController','GlobalSettingsController','DaoController','CareersListController','CareerController','LevelController','activities.GeospatialController', 'activities.VisualController', 'activities.TemporalController', 'activities.LinguisticController'],
	models: ['Activity','Career','Level','OfflineScore','User'],
	stores: ['Activities','Careers','Levels','OfflineScores','Users'],
	autoCreateViewport : true,
	
    launch: function() {
        this.getController('LoadingController').onLaunch();
    }
});
