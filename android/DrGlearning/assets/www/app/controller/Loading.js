//Ext.require('Phonegap');
Ext.define('DrGlearning.controller.Loading', {
    extend: 'Ext.app.Controller',
    //requires: 'Phonegap',
	
	views : [
	        'Loading'	,
		],
		
	stores: [
        'Careers','Activities'
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
		console.log(Connection);
		var careersStore = this.getCareersStore();
		careersStore.load();
		this.getActivitiesStore().load();
		
		//careersStore.sync();
		//console.log(careersStore.count());
		//if(this.getActivitiesStore().findExact('activity_type','linguistic')!=-1){
			//var activity=this.getActivitiesStore().getById(""+this.getActivitiesStore().findExact('activity_type','linguistic'));
		//	var activity=this.getActivitiesStore().getById(""+5);
		//	this.getLoading().down('label').setText('<img alt="imagen" src="'+activity.data.image+'" />');
			//this.getLoading().refresh();
		//}
	
		if(navigator.network.connection.type!=Connection.NONE){
			//if(navigator.network.connection.type==Connection.NONE){
			//logica de desconexion
			//}else{
			//alert(Connection.type);
			//careersStore.load({
	        //    scope   : this,
	        //    callback: function(records, operation, success) {
	            	//Career request
					
	    			Ext.data.JsonP.request({
	                    url:"http://drglearning.testing.cultureplex.ca/api/v1/career/?format=jsonp",
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
	                    			var activities=new Array();
	                    			for(cont in career.activities){
	                    				activities[cont]=career.activities[cont].full_activity_url;
	                    			}
	                    			careerModel.set('activities',activities);
	                    			careerModel.save();
	                    			careersStore.sync();
	                    			console.log("Careers stored after add = "+careersStore.count());
	                    		}else{
	                    			console.log("Career already exist -> id="+career.id);
	                    		}
	                    		
	                    	}
	                        
	                    }
	                });
	      }
			this.getLoading().hide();
			this.getController('Careers').initializate();

	
		}


});