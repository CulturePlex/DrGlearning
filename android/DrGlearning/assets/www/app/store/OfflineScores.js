Ext.define('DrGlearning.store.OfflineScores', {
	extend  : 'Ext.data.Store',
    model: 'DrGlearning.model.OfflineScore',
    requires: ['DrGlearning.model.OfflineScore'],
    autoLoad: true,
    autoSync: true,

    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});