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
    requires: 'DrGlearning.model.Career',
    autoLoad: false,
	autoSync:true,
//    load: {
//    	scope: this,
//    	callback: this.onStationsLoad,
//    	
//    }
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
      }
    	

    
});