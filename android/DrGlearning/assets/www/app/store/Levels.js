Ext.define('DrGlearning.store.Levels', {
	extend  : 'Ext.data.Store',
    requires: ['DrGlearning.model.Level'],
	config: {
		model: 'DrGlearning.model.Level',
    },
    autoLoad: true,
    autoSync: true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});