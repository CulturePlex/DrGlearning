Ext.define('DrGlearning.controller.activities.LinguisticController', {
    extend: 'DrGlearning.controller.ActivityController',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Linguistic'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.linguistic',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	activity:null,
	respuestas:null,
	initializate: function(){
		this.control({
			'button[customId=solve]': {
				tap: this.tryIt
			}
		});
	},
	updateActivity: function(view,newActivity) {
		
		this.activity= newActivity;
		view.down('component[customId=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Linguistic');
		activityView.down('panel[customId=image]').setHtml('<img alt="imagen" height="100px" src="'+newActivity.data.image+'" />');
		activityView.down('label[customId=query]').setHtml(newActivity.data.query);
		activityView.down('label[customId=loqued]').setHtml(newActivity.data.locked_text.replace(/[A-z0-9]/g,'_'));
		
		this.respuestas=this.activity.data.answers;
		console.log(this.respuestas);
		
		view.add(activityView);
		
		
	},
	tryIt: function() { 
		if (event.target.textContent == this.activity.data.answer) 
		{
			Ext.Msg.alert('Right!', this.activity.data.reward, function(){
					this.levelController.tolevel();
				}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct answer', function(){
				this.levelController.tolevel();
			}, this);
		}
		
			
	}
		
	
});
