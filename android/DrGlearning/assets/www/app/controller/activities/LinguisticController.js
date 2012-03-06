Ext.define('DrGlearning.controller.activities.LinguisticController', {
    extend:  'Ext.app.Controller',
	config: {
		fullscreen:true,
        refs: {
            linguistic: 'activities.linguistic',
            activityframe: 'activityframe',
        }
    },
	activity:null,
	respuestas:null,
	init: function(){
		this.levelController = this.getApplication().getController('LevelController');
		this.control({
			'button[customId=solve]': {
				tap: this.solve
			}
		});
		this.control({
			'button[customId=try]': {
				tap: this.tryIt
			}
		});
		
	},
	updateActivity: function(view,newActivity) {
		console.log(view);
		this.activity= newActivity;
		view.down('component[customId=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Linguistic');
		//activityView.down('panel[customId=image]').setHtml('<img alt="imagen" height="100px" src="'+newActivity.data.image+'" />');
		activityView.down('panel[customId=image]').setHtml('<table border="1" WIDTH="100%" HEIGHT="170" BACKGROUND="'+newActivity.getImage('image','image')+'"><tr><td></td><td></td></tr><tr><td></td><td BGCOLOR="BLACK"></td></tr></table>');
		activityView.down('label[customId=query]').setHtml(newActivity.data.query);
		activityView.down('label[customId=loqued]').setHtml(newActivity.data.locked_text.replace(/[A-z0-9]/g,'_'));
		activityView.down('label[customId=responses]').setHtml('');
		this.respuestas=this.activity.data.answers;
		console.log(this.activity);
		activityView.show();
		view.add(activityView);
		
		
	},
	tryIt: function() {
		var letterView=activityView.down('textfield[customId=letter]');
		var responseView=activityView.down('label[customId=responses]');
		var letter=letterView.getValue();
		letterView.setValue('');
		console.log(letter);
		if(this.activity.data.locked_text.search(letter)!=-1){
			responseView.setHtml(responseView.getHtml()+letter+' ');
		}else{
			responseView.setHtml(responseView.getHtml()+letter+' ');
		}
		
	},
	
	
	solve: function() { 
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
