Ext.define('DrGlearning.store.Careers', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.Career',
    requires: ['DrGlearning.model.Career'],
    autoLoad: true,
    autoSync:true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});