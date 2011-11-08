/*Ext.create('DrGlearning.store.Careers', {
    extend  : 'Ext.data.Store',
    model   : 'DrGlearning.model.Career',
    requires: ['DrGlearning.model.Career'],
    
    autoLoad    : true
});
*/


Ext.define('DrGlearning.store.Careers', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.Career',
    requires: ['DrGlearning.model.Career','DrGlearning.model.Activities'],
    autoLoad: true,
    autoSync:true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    },
    getInstalled: function() {
		return this.findExact('installed','true');
	},
    installCareer: function(id) {
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
    	Ext.data.JsonP.request({
            url:"http://129.100.65.186:8000/api/v1/career/?format=jsonp",
            success:function(response, opts){
            	console.log("Activities retrieved");
            	
            }
        });
	}
	

    	

    
});