Ext.define('DrGlearning.store.Careers', {
	extend  : 'Ext.data.Store',
    requires: ['DrGlearning.model.Career'],
    config: {
    	model: 'DrGlearning.model.Career',
        autoLoad: true,
        autoSync: true,
    },
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});
