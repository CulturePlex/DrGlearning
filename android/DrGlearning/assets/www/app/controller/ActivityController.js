/**
 * @class DrGlearning.controller.ActivityController
 * @extends Ext.app.Controller
 *
 * Controller to manage Activity Logic. Is parent Class of each specific activity.
 */

//Global Words to skip JSLint validation//
/*global Ext i18n google GeoJSON activityView event clearInterval setInterval DrGlearning*/

Ext.define('DrGlearning.controller.ActivityController', {
    extend: 'Ext.app.Controller',
    activityView: null,
    /*
     * Initializate Controller.
     */
    init: function ()
	{
        this.levelController = this.getApplication().getController('LevelController');
    },
    addQueryAndButtons: function (activityView, newActivity)
	{
        //console.log(activityView);
        activityView.down('toolbar[customId=query]').add({
            xtype: 'titlebar',
            name: 'label_name',
            customId: 'query_label',
            id: 'label_id',
            cls: 'query',
            title: newActivity.data.query,
            flex: 1,
            ui: 'neutral',
            style: 'font-size:13px'
        });
        var that = this;
        activityView.down('toolbar[customId=query]').down('titlebar').setListeners({
            tap: {
                fn: function ()
				{
                    that.levelController.more(that.levelController);
                },
                element: 'element'
            }
        });
        activityView.down('toolbar[customId=query]').add({
            xtype: 'button',
            text: '?',
            ui: 'round',
            id: 'help',
            pack: 'middle'
        });
    }
});
