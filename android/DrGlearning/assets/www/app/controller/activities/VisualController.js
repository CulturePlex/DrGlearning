Ext.define('DrGlearning.controller.activities.VisualController', {
    extend: 'DrGlearning.controller.ActivityController',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Geospatial'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.geospatial',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	activity:null,
	respuestas:null,
	initializate: function(){
		this.control({
			'button[customId=respuesta]': {
				tap: this.tryIt
			}
		});
	},
	updateActivity: function(view,newActivity) {
		
		this.activity= newActivity;
		view.down('component[customId=activity]').destroy();
		activityView = Ext.create('DrGlearning.view.activities.Visual');
		console.log(newActivity.data.answers);
		activityView.down('panel[customId=image]').setHtml('<img alt="imagen" width="100%" src="'+newActivity.data.image+'" />');
		activityView.down('label[customId=query]').setHtml(newActivity.data.query);
		this.respuestas=this.activity.data.answers;
		console.log(this.respuestas);
		
		view.add(activityView);
		var opciones=6;
		var time=newActivity.data.time;
		console.log(time);
		
		var t=setTimeout(function(thisObj) { thisObj.showAnswers(); }, time, this);
		
		var increment=0;
		while(time>0)
		{
			var t=setTimeout("activityView.down('label[customId=time]').setHtml('"+time/1000+"s');",increment);
			increment=increment+1000;
			time=time-1000;	
		}
		
	},
	showAnswers: function() {
		
		var opciones = Ext.create('Ext.Container');
		opciones.config={layout:{type:'vbox',pack:'center',align:'middle'}};
		console.log(this.respuestas.length);
		for(var i=0;i<this.respuestas.length;i++)
		{
			opciones.add({
				xtype: 'button',
				text: this.respuestas[i],
				ui: 'round',
				customId: 'respuesta'
			});
		}
		activityView.down('label[customId=time]').hide();
		activityView.down('label[customId=time]').destroy();
		activityView.down('panel[customId=image]').hide();
		activityView.down('panel[customId=image]').destroy();
		activityView.add(opciones);
			
	},
	tryIt: function() { 
		if (event.target.textContent == this.activity.data.correct_answer) 
		{
			Ext.Msg.alert('Right!', this.activity.data.reward, function(){
					this.getController('DaoController').activityPlayed(this.activity.data.id,true,500);
					this.levelController.nextActivity();
				}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct answer', function(){
				this.levelController.tolevel();
			}, this);
		}
		
			
	}
		
	
});
