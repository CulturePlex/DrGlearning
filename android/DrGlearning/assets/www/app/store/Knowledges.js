Ext.define('DrGlearning.store.Knowledges', {
	extend  : 'Ext.data.Store',
    requires: ['DrGlearning.model.Knowledge'],
    config: {
    	model: 'DrGlearning.model.Knowledge',
        autoLoad: true,
        autoSync: true,
        sorters: [
            {
                property : 'name',
                direction: 'DESC'
            },
        ]
    },
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});
