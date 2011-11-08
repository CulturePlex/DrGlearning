Ext.define('DrGlearning.store.Activities', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.Activities',
    requires: ['DrGlearning.model.Activities'],
    autoLoad: true,
    autoSync:true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});