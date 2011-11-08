Ext.define('DrGlearning.store.Levels', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.Level',
    requires: ['DrGlearning.model.Level'],
    autoLoad: true,
    autoSync:true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});