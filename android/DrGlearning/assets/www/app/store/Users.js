Ext.define('DrGlearning.store.Users', {
	extend  : 'Ext.data.Store',
	config: {
		model: 'DrGlearning.model.User',
		autoLoad: true,
	    autoSync: true,
	},


    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});