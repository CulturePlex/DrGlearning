
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
    	console.log("actividad "+activities);
		for (cont in activities){
			console.log(activities[cont]);
			Ext.data.JsonP.request({
                url:'http://129.100.65.186:8000'+activities[cont]+'?format=jsonp',
                success:function(response, opts){
                	console.log(response);
                    console.log(opts);
                }
            });
		}
		callback(scope);
    	/*Ext.data.JsonP.request({
            url:"http://129.100.65.186:8000/api/v1/career/?format=jsonp",
            success:function(response, opts){
            	console.log("Activities retrieved");
            	
            }
       // });*/
	}
});