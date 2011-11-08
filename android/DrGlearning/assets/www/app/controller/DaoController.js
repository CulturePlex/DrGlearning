
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
		return this.findExact('installed','true');
	},
    installCareer: function(id,callback) {
    	var career=this.findExact('id',id);
    	var activities=career.get('activities').split(",");
		for (cont in activities){
			console.log(activities[cont]);
			Ext.data.JsonP.request({
                url:'http://129.100.65.186:8000'+activities[cont]+'?format=jsonp',
                success:function(response, opts){
                	console.log("ola");
                    console.log(response);
                    console.log(opts);
                }
            });
		}
		callback();
    	/*Ext.data.JsonP.request({
            url:"http://129.100.65.186:8000/api/v1/career/?format=jsonp",
            success:function(response, opts){
            	console.log("Activities retrieved");
            	
            }
       // });*/
	}
});