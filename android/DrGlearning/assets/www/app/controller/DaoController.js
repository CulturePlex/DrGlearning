
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
    installCareer: function(id,callback) {
    	var career=this.getCareersStore().getById(id);
    	var activities=career.data.activities;
    	activities=activities.split(",")
    	console.log("activity "+activities);
		for (cont in activities){
			console.log(activities[cont]);
			Ext.data.JsonP.request({
                url:'http://129.100.65.186:8000'+activities[cont]+'?format=jsonp',
                success:function(response, opts){
                	console.log(response);
                	var activity=response["objects"];
                	console.log("Careers stored "+careersStore.count());
                	var activityModel=new DrGlearning.model.Activities({
                		id : activity.id,
                		name : activity.name,
                		careerId : id,
                		activity_type : activity.activity_type,
                		language_code : activity.language_code,
                		level : activity.level,
                		query : activity.query,
                		timestamp : activity.timestamp,
                		resource_uri : activity.resource_uri
                	});
                	activityModel.save();
                	this.getStoreActivities().sync();
                }
            });
		}
		var career=this.getStoreCareers().getById(id);
    	career.set({installed:true});
    	this.getStoreCareers().sync();
    	callback();
		
		
    	/*Ext.data.JsonP.request({
            url:"http://129.100.65.186:8000/api/v1/career/?format=jsonp",
            success:function(response, opts){
            	console.log("Activities retrieved");
            	
            }
       // });*/
	}
});