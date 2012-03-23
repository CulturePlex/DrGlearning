Ext.define('DrGlearning.controller.activities.TemporalController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['ActivityFrame', 'activities.Temporal'],
	controllers: ['DrGlearning.controller.Careers'],
    stores: ['Careers','Levels','Activities'],
	refs: [{
        ref: 'activities.temporal',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }],	
	activity:null,
	puntos:null,
	init: function(){
		this.levelController = this.getApplication().getController('LevelController');
		this.control({
			'button[customId=after]': {
				tap: this.after
			},
			'button[customId=before]': {
				tap: this.before
			}
		});
	},
	updateActivity: function(view,newActivity) {
		this.activity=newActivity;
		if(view.down('component[customId=activity]'))
		{
			view.down('component[customId=activity]').hide();
			view.down('component[customId=activity]').destroy();
		}
		activityView = Ext.create('DrGlearning.view.activities.Temporal');
		console.log(newActivity.data);
		activityView.down('panel').setHtml('<img id="image" alt="imagen" src="'+newActivity.getImage('image','image',this)+'" />');
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
		}			);
		activityView.show();
		view.add(activityView);
	},
	before: function() {
		this.puntos=100;
		console.log(this.activity);
		if (this.activity.data.image_datetime < this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward+" obtained score: "+this.puntos, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
			},this);
		}else
		{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				this.getApplication().getController('LevelController').tolevel();
			},this);
		} 
	},
	after: function() {
		this.puntos=100;
		if (this.activity.data.image_datetime > this.activity.data.query_datetime) {
			Ext.Msg.alert('Success!', this.activity.data.reward+" obtained score: "+this.puntos, function(){
				this.getApplication().getController('DaoController').activityPlayed(this.activity.data.id,true,this.puntos);
				console.log('ola');
				this.getApplication().getController('LevelController').nextActivity(this.activity.data.level_type);
			},this);
		}else
		{
			Ext.Msg.alert('Wrong!', 'Oooh, it wasnt the correct answer', function(){
				this.getApplication().getController('LevelController').tolevel();
			},this);
		} 
	}
});
