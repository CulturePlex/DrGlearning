
Ext.define('DrGlearning.controller.DaoController', {
    extend: 'Ext.app.Controller',
   stores: [
        'Careers','Activities'
    ],
	
	init: function(){
		
	},
	
	onLaunch: function() {
		
	},
	getInstalled: function() {
		return this.getCareersStore().findExact('installed','true');
	},
    installCareer: function(id,callback,scope) {
    	var career=this.getCareersStore().getById(id);
    	var activities=career.data.activities;
    	activities=activities.split(",")
    	console.log("activity "+activities);
		for (cont in activities){
			console.log(activities[cont]);
			Ext.data.JsonP.request({
				scope: this,
                url:'http://drglearning.testing.cultureplex.ca/'+activities[cont]+'?format=jsonp',
                success:function(response, opts){
                	var activity=response;
                	var activityModel=new DrGlearning.model.Activity({
                		id : activity.id,
                		name : activity.name,
                		careerId : id,
                		activity_type : activity.activity_type,
                		language_code : activity.language_code,
                		level_type : activity.level_type,
                		level_order : activity.level_order,
                		level_required : activity.level_required,
                		query : activity.query,
                		timestamp : activity.timestamp,
                		resource_uri : activity.resource_uri
                	});
                	if(activityModel.data.activity_type=='linguistic'){
                		activityModel.data.image=activity.image;
                		activityModel.data.locked_text=activity.locked_text;
                		activityModel.data.answer=activity.answer;
                	}
                	activityModel.save();
                	this.getActivitiesStore().sync();
                }
            });
		}
		var career=this.getCareersStore().getById(id);
    	career.set('installed','true');
    	this.getCareersStore().sync();
    	callback(scope);

    },
    
    /* 
     * Return the max level
     */
	getLevels: function(careerId){
		var levels=new Array();
		var activities=this.getActivitiesStore().queryBy(function(record) {
			return record.data.careerId==careerId;
		});
		activities.each(function(item) {
			if(levels[item.data.level_type]==undefined){
				levels[item.data.level_type]=item.data.level_type;
			}
		});
		levels.sort(function(a, b) {
			return a - b;
		});
		console.log(levels.length);
		return levels;
	},
	/*
	 * Returns a MixedCollection 
	 */
	getActivitiesByLevel: function(careerId,level){
		var activities=this.getActivitiesStore().queryBy(function(record) {
			return record.data.careerId==careerId && record.data.level_type==level;
		});
		return activities;
	}
	/*
	 * 
	 */
	
});