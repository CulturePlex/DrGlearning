/**
 * @class DrGlearning.controller.ActivityController
 * @extends Ext.app.Controller
 *
 * Controller to manage Activity Logic. Is parent Class of each specific activity.
 */
Ext.define('DrGlearning.controller.ActivityController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers', 'DrGlearning.store.Levels', 'DrGlearning.controller.DaoController'],
    views: ['LevelFrame', 'ActivityFrame'],
    stores: ['Careers', 'Levels', 'Activities', 'Users'],
    refs: [{
        ref: 'levelframe',
        selector: 'levelframe',
        xtype: 'levelframe'
    }, {
        ref: 'activityframe',
        selector: 'activityframe',
        xtype: 'activityframe'
    }],
    activityView: null,
    /*
     * Initializate Controller.
     */
    init: function(){
    
    },
    addQueryAndButtons: function(activityView, newActivity){
    
        activityView.down('toolbar[customId=query]').add({
            xtype: 'label',
            name: 'label_name',
            id: 'label_id',
            html: newActivity.data.query,
            width: '70%',
        });
        activityView.down('toolbar[customId=query]').add({
            xtype: 'spacer'
        });
        activityView.down('toolbar[customId=query]').add({
            xtype: 'button',
            text: '...',
            ui: 'round',
            id: 'more'
        });
        activityView.down('toolbar[customId=query]').add({
            xtype: 'button',
            text: '?',
            ui: 'round',
            id: 'help'
        });
    }
});
