/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed catalogueEN catalogueES catalogueFR
*/

// Locale
var i18n;

if (localStorage.catalogue === 'es') {
    i18n = new Jed({
        locale_data : catalogueES,
        "domain": "messages"
    });
    localStorage.catalogue = 'es';
} else if (localStorage.catalogue === 'fr') {
    i18n = new Jed({
        locale_data : catalogueFR,
        "domain": "messages"
    });
    localStorage.catalogue = 'fr';
} else {
    // English by default
    i18n = new Jed({
        locale_data : catalogueEN,
        "domain": "messages"
    });
    localStorage.catalogue = 'en';
}

Ext.Loader.setConfig({
    enabled : true
});

Ext.application({
    name: 'DrGlearning',
    views: ['Loading', 'CareerFrame', 'CareersListEmpty', 'Main', 'LevelFrame',
            'CareersList', 'ActivityFrame', 'activities.Geospatial',
            'activities.Visual', 'activities.Linguistic', 'activities.Temporal',
            'activities.Relational', 'activities.Quiz', 'Settings'],
    controllers: ['LoadingController', 'GlobalSettingsController', 'DaoController',
                  'CareersListController', 'CareerController', 'LevelController',
                  'ActivityController', 'activities.GeospatialController',
                  'activities.VisualController', 'activities.TemporalController',
                  'activities.LinguisticController', 'activities.RelationalController',
                  'UserSettingsController', 'FileManagerController',
                  'MaxStorageSizeController', 'activities.QuizController'],
    models: ['Activity', 'Career', 'Level', 'OfflineScore', 'User'],
    stores: ['Activities', 'Careers', 'Levels', 'OfflineScores', 'Users'],
    autoCreateViewport : true,
    requires: ['Ext.Anim'],
    launch: function () {
        "use strict";
        this.getController('LoadingController').onLaunch();
        this.levelController = this.getApplication().getController('LevelController');
    }
});
