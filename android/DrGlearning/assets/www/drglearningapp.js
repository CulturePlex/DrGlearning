/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
/*global
    Ext Jed messages
*/

Ext.Loader.setConfig({
    enabled : true
});

Ext.application({
    name: 'DrGlearning',
    views: ['Loading', 'CareerFrame', 'Main', 'LevelFrame',
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
    models: ['Activity', 'Career', 'Level', 'OfflineScore', 'User', 'Knowledge'],
    stores: ['Activities', 'Careers', 'Levels', 'OfflineScores', 'Users', 'Knowledges'],
    autoCreateViewport : true,
    requires: ['Ext.Anim'],
    launch: function () {
        "use strict";
        this.getController('LoadingController').onLaunch();
        this.levelController = this.getApplication().getController('LevelController');
    }
});

var MB = Ext.MessageBox;
Ext.apply(MB, {
		YES: { text: i18n.gettext('Yes'), itemId: 'yes', ui: 'action' }
});
Ext.apply(MB, {
		NO: { text: i18n.gettext('No'), itemId: 'no' }
});
Ext.apply(MB, {
		YESNO: [Ext.MessageBox.NO, Ext.MessageBox.YES]
});

Ext.picker.PickerView.applyDoneButton(i18n.gettext('Done'));
Ext.picker.PickerView.applyCancelButton(i18n.gettext('Cancel'));



