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
		Ext.Viewport.setMasked({
    	    xtype: 'loadmask',
    	    message: 'Loading activity...',
 	       	indicator: true,
			//html: "<img src='resources/images/activity_icons/quiz.png'>",
    	});
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
		console.log("Tiene imagen?");

		this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);
		this.respuestas=this.activity.data.answers;
		var opciones=6;
		var time=newActivity.data.time;
		this.currentTime=time;
		this.finishtemp=setTimeout(function(thisObj) { thisObj.showAnswers(); }, time*1000, this);
		this.secondtemp=setInterval(function(thisObj) { thisObj.showSeconds(); },1000,this);
		if (newActivity.data.image_url) {
			//activityView.down('panel[id=image]').setHtml('<img alt="imagen" width="100%" src="' + newActivity.getImage('image','image', this) + '" />');
			newActivity.getImage('image','image',activityView.down('[id=image]'),this,view,activityView,false);
		}else{
			this.loadingImages(view,activityView);
		}
	
	},loadingImages:function(view,activityView){
		activityView.show();
		view.add(activityView);
		Ext.Viewport.setMasked(false);
		if(!this.helpFlag)
		{
			this.getApplication().getController('LevelController').help();
			this.helpFlag=true;
		}
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
		activityView.down('panel[id=image]').hide();
		activityView.down('panel[id=image]').destroy();
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