//Locale
if(localStorage.catalogue==undefined){
	var i18n = new Jed({
		  locale_data : catalogueEN,
		  "domain" : "messages"
	});
	localStorage.catalogue='en';
}else if(localStorage.catalogue=='en'){
	var i18n = new Jed({
		  locale_data : catalogueEN,
		  "domain" : "messages"
	});	
	localStorage.catalogue='en';
}else if(localStorage.catalogue=='fr'){
	var i18n = new Jed({
		  locale_data : catalogueFR,
		  "domain" : "messages"
	});
	localStorage.catalogue='fr';
}



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
