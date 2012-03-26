Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : 'DrGlearning',
	views : [ 'Loading','CareerFrame', 'CareersListEmpty','Main','LevelFrame', 'CareersList', 'ActivityFrame','activities.Geospatial', 'activities.Visual', 'activities.Linguistic', 'activities.Temporal', 'activities.Relational', 'activities.Quiz', 'Settings' ],
	controllers : [ 'LoadingController','GlobalSettingsController','DaoController','CareersListController','CareerController','LevelController','ActivityController', 'activities.GeospatialController', 'activities.VisualController', 'activities.TemporalController', 'activities.LinguisticController', 'activities.RelationalController','UserSettingsController','FileManagerController','MaxStorageSizeController', 'activities.QuizController'],
	models: ['Activity','Career','Level','OfflineScore','User'],
	stores: ['Activities','Careers','Levels','OfflineScores','Users'],
	autoCreateViewport : true,
	
    launch: function() {
        this.getController('LoadingController').onLaunch();
    }
});
