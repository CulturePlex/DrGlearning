Ext.define('DrGlearning.store.Activities', {
	extend  : 'Ext.data.Store',
    requires: ['DrGlearning.model.Activity'],
    config: {
    	model: 'DrGlearning.model.Activity',
        autoLoad: true,
        autoSync: true,
    },

   
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});