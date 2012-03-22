Ext.define('DrGlearning.controller.activities.QuizController', {
    extend: 'Ext.app.Controller',
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
	currentTime:null,
	finishtemp:null,
	secondtemp:null,
	init: function(){
		this.levelController = this.getApplication().getController('LevelController');
		this.control({
			'button[customId=respuestaQuiz]': {
				tap: this.tryIt
			}
		});
	},
	updateActivity: function(view,newActivity) {
		
		this.activity= newActivity;
		console.log(view.down('component[customId=activity]'));
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		activityView = Ext.create('DrGlearning.view.activities.Quiz');
		console.log(newActivity.data.answers);
		console.log(newActivity.data.image);
		if (newActivity.data.image) {
			activityView.down('panel[customId=image]').setHtml('<img alt="imagen" width="100%" src="' + newActivity.getImage('image', 'image', this) + '" />');
		}
		activityView.down('label[customId=query]').setHtml(newActivity.data.query);
		this.respuestas=this.activity.data.answers;
		console.log(this.respuestas);
		activityView.show();
		view.add(activityView);
		var opciones=6;
		var time=newActivity.data.time;
		this.currentTime=time;
		this.finishtemp=setTimeout(function(thisObj) { thisObj.showAnswers(); }, time*1000, this);
		this.secondtemp=setInterval(function(thisObj) { thisObj.showSeconds(); },1000,this);
		this.showSeconds();
				
	},
	showAnswers: function() {
		clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
		
		var opciones = Ext.create('Ext.Container');
		opciones.config={layout:{type:'vbox',pack:'center',align:'middle'}};
		console.log(this.respuestas.length);
		for(var i=0;i<this.respuestas.length;i++)
		{
			activityView.down('container[customId=time]').add({
				xtype: 'button',
				text: this.respuestas[i],
				ui: 'round',
				padding: 5,
				customId: 'respuestaQuiz'
			});
		}
		//activityView.down('label[customId=time]').hide();
		//activityView.down('label[customId=time]').destroy();
		activityView.down('label[customId=time]').setHtml("");
		activityView.down('panel[customId=image]').hide();
		activityView.down('panel[customId=image]').destroy();
		activityView.add(opciones);
			
	},
	showSeconds: function() { 
		activityView.down('label[customId=time]').setHtml(this.currentTime+"s");
		this.currentTime--;	
	},
	tryIt: function() { 
	this.puntos=100;
		if (event.target.textContent == this.activity.data.correct_answer) 
		{
			Ext.Msg.alert('Right!', this.activity.data.reward+" obtained score: "+this.puntos, function(){
					this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
					console.log('aski');
					this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
				}, this);
		}else{
			Ext.Msg.alert('Wrong!', 'Oooh, it isnt the correct answer', function(){
				this.getApplication().getController('LevelController').tolevel();
			}, this);
		}
		
			
	},
	stop: function() { 
		clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
			
	}
		
	
});
