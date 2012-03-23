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
	init: function(){
		this.levelController = this.getApplication().getController('LevelController');
		this.control({
			'button[customId=respuesta]': {
				tap: this.tryIt
			}
		});
	},
	updateActivity: function(view,newActivity) {
		
		this.activity= newActivity;
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		activityView = Ext.create('DrGlearning.view.activities.Visual');
		activityView.down('container[id=image]').setHtml('<img alt="imagen" width="100%" src="'+newActivity.getImage('image','image',this)+'" />');
		activityView.down('toolbar[customId=query]').add( 
		{ 
            xtype: 'label', 
            name: 'label_name', 
            id: 'label_id', 
            html: newActivity.data.query, 
			width: '80%',
			} );
		activityView.down('toolbar[customId=query]').add(
		{
			xtype:'spacer'
			});
		
		activityView.down('toolbar[customId=query]').add(
		{
			xtype:'button',
			text:'?',
			ui:'round',
			id:'help'
		}	);
		this.respuestas=this.activity.data.answers;
		activityView.show();
		view.add(activityView);
		var opciones=6;
		var time=newActivity.data.time;
		this.currentTime=time;
		this.finishtemp=setTimeout(function(thisObj) { thisObj.showAnswers(); }, time*1000, this);
		this.secondtemp=setInterval(function(thisObj) { thisObj.showSeconds(); },1000,this);
		this.showSeconds();
		if(!this.helpFlag)
		{
			this.getApplication().getController('LevelController').help();
			this.helpFlag=true;
		}
	},
	showAnswers: function() {
		clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
		var obfuscatedImg = Ext.create('Ext.Container',{
			customId: 'obfuscated',
    		layout: 'vbox',
			align:'center',
			pack:'center',
			padding: 10,
			html:'<img alt="imagen" width="100%" src="'+newActivity.data.obfuscated_image+'" />'
    		
    	});
		var options = Ext.create('Ext.Container',{
    		layout: 'vbox',
			align:'bottoom',
			pack:'bottom',
			padding: 10,
			height:'50%',
    		
    	});
		for(var i=0;i<this.respuestas.length;i++)
		{
			activityView.down('container[customId=time]').add({
				xtype: 'button',
				text: this.respuestas[i],
				ui: 'round',
				padding: 5,
				customId: 'respuesta',
			});
		}
		activityView.down('label[customId=time]').setHtml("");
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
		activityView.down('label[customId=time]').setHtml(this.currentTime+"s");
		this.currentTime--;	
	},
	stop: function() { 
		clearInterval(this.finishtemp);
		clearInterval(this.secondtemp);
			
	}
		
	
});
