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
		console.log(this.levelController);
		console.log('asssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss');
		this.careersListController=this.getController('CareersListController');
		this.getActivityFrameView().create();
		this.activityView=this.getActivityframe();
       	this.control({
            'button[customId=backtolevel]': {
                tap: this.tolevel
            }
		});
    },
	tolevel: function(){
        if (this.activityView) {
            this.activityView.hide();
        }
		console.log(this.levelController);
        var view1 = this.levelController.getLevelframe();
		this.levelController.updateLevel(this.careersListController.selectedcareer, this.levelController.selectedlevel);		
        view1.show();
    }
 	
});
