Ext.define('DrGlearning.controller.activities.VisualController', {
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
	finishtemp:null,
	secondtemp:null,
	currentTime:0,
	puntos:null,
	parado:false,
	init: function(){
		this.parado=false;
		this.levelController = this.getApplication().getController('LevelController');
		this.control({
			'button[customId=respuesta]': {
				tap: this.tryIt
			}
		});
	},
	updateActivity: function(view,newActivity) {
		Ext.Viewport.setMasked({
    	    xtype: 'loadmask',
    	    message: 'Loading activity...',
 	       	indicator: true,
			html: "<img src='resources/images/activity_icons/visual.png'>",
    	});
		this.activity= newActivity;
		
		view.down('component[customId=activity]').destroy();
		
		activityView = Ext.create('DrGlearning.view.activities.Visual');
		activityView.down('container[customId=time]').down('container[customId=options]').removeAll();
		//activityView.down('container[id=image]').setHtml('<img alt="imagen" width="100%" src="'+newActivity.getImage('image','image',this)+'" />');
		newActivity.getImage('image','image',activityView.down('container[id=image]'),this,view,activityView,false);
		this.getApplication().getController('ActivityController').addQueryAndButtons(activityView,newActivity);
		this.respuestas=this.activity.data.answers;
		
		var opciones=6;
		var time=newActivity.data.time;
		this.currentTime=time;
		//this.finishtemp=setTimeout(function(thisObj) { thisObj.showAnswers(); }, time*1000, this);
		this.secondtemp=setInterval(function(thisObj) { thisObj.showSeconds(); },1000,this);
		
		
		
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
		//clearInterval(this.finishtemp);
		var obfuscatedImg = Ext.create('Ext.Container',{
			customId: 'obfuscated',
    		layout: 'vbox',
			align:'center',
			pack:'center',
			padding: 10,
			html:'<img alt="imagen" width="100%" src="'+this.activity.data.obfuscated_image+'" />'
    		
    	});
		var options = Ext.create('Ext.Container',{
    		layout: 'vbox',
			align:'bottoom',
			pack:'bottom',
			padding: 10,
			height:'50%',
    		
    	});
		activityView.down('container[customId=time]').down('container[customId=options]').removeAll();
		for(var i=0;i<this.respuestas.length;i++)
		{
			activityView.down('container[customId=time]').down('container[customId=options]').add({
				xtype: 'button',
				text: this.respuestas[i],
				ui: 'round',
				padding: 5,
				customId: 'respuesta',
			});
		}
		activityView.down('container[id=image]').hide();
		activityView.down('container[id=image]').destroy();
		activityView.add(obfuscatedImg);
			
	},
	tryIt: function() { 
	this.puntos= 100;
		if (event.target.textContent == this.activity.data.correct_answer) 
		{
			Ext.Msg.alert('Right!', this.activity.data.reward+", obtained score:"+this.puntos, function(){
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
	showSeconds: function() { 
	
	if (this.parado==false) {
		activityView.down('label[customId=time]').setHtml(this.currentTime + "s");
		this.currentTime--;
		if(this.currentTime<0)
		{
			clearInterval(this.secondtemp);
			this.showAnswers();
		}
	}	
	},
	stop: function() { 
		//clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
			
	},
	stopNotClear: function() { 
		this.parado=true;
	},
	restart: function() { 
		this.parado=false;
	}
		
	
});