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
    	    message: i18n.gettext('Loading activity...'),
 	       	indicator: true,
			//html: "<img src='resources/images/activity_icons/quiz.png'>",
    	});
		this.activity= newActivity;
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		activityView = Ext.create('DrGlearning.view.activities.Quiz');

		this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);
		this.respuestas=this.activity.data.answers;
		var opciones=6;
		var time=newActivity.data.time;
		this.currentTime=time;
		if (newActivity.data.image_url) {
			newActivity.getImage('image','image',activityView.down('[id=image]'),this,view,activityView,false);
		}else{
			this.loadingImages(view,activityView);
		}
		this.showAnswers();
	
	},loadingImages:function(view,activityView){
		activityView.show();
		view.add(activityView);
		Ext.Viewport.setMasked(false);
		if(!this.helpFlag)
		{
			this.getApplication().getController('LevelController').helpAndQuery();
			this.helpFlag=true;
		}
		this.showSeconds();
	},
	showAnswers: function() {
		clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
		
		var opciones = Ext.create('Ext.Container');
		opciones.config={layout:{type:'vbox',pack:'center',align:'middle'}};
		for(var i=0;i<this.respuestas.length;i++)
		{
			activityView.down('container[customId=time]').add({
				xtype: 'button',
				text: this.respuestas[i],
				ui: 'small',
				margin: 3,
				customId: 'respuestaQuiz'
			});
		}
		activityView.down('label[customId=time]').setHtml("");
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
			activityView.down('container[customId=time]').down('button[text='+this.activity.data.correct_answer+']').setUi('confirm-small');		
			Ext.Msg.alert(i18n.gettext('Right!'), this.activity.data.reward+i18n.gettext(" obtained score: ")+this.puntos, function(){
					this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
					this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
				}, this);
		}else{
			activityView.down('container[customId=time]').down('button[text='+event.target.textContent+']').setUi('decline-small');
			Ext.Msg.alert(i18n.gettext('Wrong!'), ('Oooh, it isnt the correct answer'), function(){
				this.getApplication().getController('LevelController').tolevel();
			}, this);
		}
		
			
	},
	stop: function() { 
		clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
			
	}
		
	
});