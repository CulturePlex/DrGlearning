Ext.define('DrGlearning.store.Activities', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.Activity',
    requires: ['DrGlearning.model.Activity'],
    autoLoad: true,
    autoSync: true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});