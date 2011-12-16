/**
 * @class DrGlearning.controller.ActivityController
 * @extends Ext.app.Controller
 *
 * Controller to manage Activity Logic. Is parent Class of each specific activity.
 */
Ext.define('DrGlearning.controller.ActivityController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.controller.DaoController'],
    views: ['LevelFrame','ActivityFrame'],
    stores: ['Careers','Levels','Activities','Users'],
    refs: [{
        ref: 'levelframe',
        selector: 'levelframe',
        xtype: 'levelframe'
    }, {
        ref: 'activityframe',
        selector: 'activityframe',
        xtype: 'activityframe'
    }
	],
	activityView:null,
	/*
	 * Initializate Controller.
	 */
    init: function(){
		this.levelController=this.getController('LevelController');
		this.careersListController=this.getController('CareersListController');
		this.levelController=this.getController('LevelController');
		this.getActivityFrameView().create();
       	this.control({
            'button[customId=backtolevel]': {
                tap: this.tolevel
            }
		});
    },
 	tolevel: function(){
        if (this.levelController.getActivityframe()) {
            this.levelController.getActivityframe().hide();
        }
        var view1 = this.levelController.getLevelframe();
		this.levelController.updateLevel(this.careersListController.selectedcareer, this.levelController.selectedlevel);		
        view1.show();
    }
});
