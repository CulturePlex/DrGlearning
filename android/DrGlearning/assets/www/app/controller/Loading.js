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
	
	refs: [
        {
            ref     : 'loading',
            selector: 'loading',
            xtype   : 'loading'
        }
		],
		
	init: function(){
		this.getLoadingView().create();
		
	},
	
	onLaunch: function() {
		var careersStore = this.getCareersStore();
		careersStore.load();
		//careersStore.sync();
		//console.log(careersStore.count());
		if(false){
			//if(navigator.network.connection.type==Connection.NONE){
			//logica de desconexion
			//}else{
		}else{
			//alert(Connection.type);
			//careersStore.load({
	        //    scope   : this,
	        //    callback: function(records, operation, success) {
	            	//Career request
	    			Ext.data.JsonP.request({
	                    url:"http://129.100.65.186:8000/api/v1/career/?format=jsonp",
	                    scope   : this,
	                    success:function(response, opts){
	                    	console.log("Careers retrieved");
	                    	var careers=response["objects"];
	                    	for (cont in careers) {
	                    		var career=careers[cont];
	                    		//its a new career?
	                    		console.log("Careers stored "+careersStore.count());
	                    		if(careersStore.findExact("id",career.id)==-1){
	                    			console.log("New Career found -> id="+career.id);
	                    			var careerModel=new DrGlearning.model.Career({
	                    					id : career.id,
	                    					activities : career.activities,
	                        				negative_votes : career.negative_votes,
	                        				positive_votes : career.positive_votes,
	                        				name : career.name,
	                        				description : career.description,
	                        				creator : career.creator,
	                        				resource_uri : career.resource_uri,
	                        				knowledges : career.knowledges,
	                        				timestamp : career.timestamp,
	                        				installed : false,
	                    					started : false
	                    			});
	                    			careerModel.save();
	                    			careersStore.sync();
	                    			console.log("Careers stored after add = "+careersStore.count());
	                    		}else{
	                    			console.log("Career already exist -> id="+career.id);
	                    		}
	                    		
	                    	}
	                    	this.getLoading().hide();					
        					this.getController('Careers').initializate();
	                        
	                    }
	                });
	      }
			//});
			

	        /*careersStore.load({
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
					this.getLoading().hide();					
					this.getController('Careers').initializate();
	            }
	        });*/
	
		}
				//}
//   },

});