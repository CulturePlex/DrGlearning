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
    	console.log(activityView);
        activityView.down('toolbar[customId=query]').add({
            xtype: 'titlebar',
            name: 'label_name',
			customId: 'query_label',
            id: 'label_id',
			cls:'query',
            title: newActivity.data.query,
            flex:1,
			ui: 'neutral',
			style: 'font-size:13px'
		
			
        });
		var that= this;
		activityView.down('toolbar[customId=query]').down('titlebar').setListeners({
			tap: {
				fn: function(e,that,eso){
					DrGlearning.app.getApplication().getController('LevelController').more();
				},
				element: 'element'
			}
		});
        activityView.down('toolbar[customId=query]').add({
            xtype: 'button',
            text: '?',
            ui: 'round',
            id: 'help',
			pack:'middle'
        });
    }
});
