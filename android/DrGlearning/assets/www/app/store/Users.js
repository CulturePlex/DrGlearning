Ext.define('DrGlearning.store.Users', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.User',
    requires: ['DrGlearning.model.User'],
    autoLoad: true,
    autoSync: true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});