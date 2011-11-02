//Ext.require('Phonegap');
Ext.define('DrGlearning.controller.Loading', {
    extend: 'Ext.app.Controller',
    //requires: 'Phonegap',
	
	views : [
	        'Loading'	,
		],
		
	stores: [
        'Careers'
    ],
	
	init: function(){
		this.getLoadingView().create();
		
	},
	onLaunch: function() {
		console.log("lanzada");
		//if(navigator.network.connection.type==Connection.NONE){
			//logica de desconexion
		//}else{
		//alert(Connection.type);
			var careersStore = this.getCareersStore();
	        careersStore.load({
	            scope   : this,
	            callback: function(records, operation, success) {
	            	console.log("Cargada");
	        		//console.log(this.getCareersStore().data.items[0].data.activities);
	        		this.getCareersStore().data.each(function(career) {
	                    //console.log(career.get('name'));
	        			var activities=career.get('activities').split(",");
	        			for (cont in activities){
	        				console.log(activities[cont]);
	        				Ext.data.JsonP.request({
	                            url:"http://129.100.65.186:8000"+activities[cont]+"?format=jsonp",
	                            success:function(response, opts){
	                            	console.log("ola");
	                                console.log(response);
	                                console.log(opts);
	                            }
	                        });
	        				
	        			}
	        			//activities.each(function(url) {
	        			//	console.log(url);
	        			//});
	        					
	        		});
	        		this.getController('Careers').getMainView();
	            }
	        });
		//}
    },

});