Ext.define('DrGlearning.store.Activities', {
	extend  : 'Ext.data.Store',
    requires: ['DrGlearning.model.Activity'],
    config: {
    	model: 'DrGlearning.model.Activity',
        autoLoad: true,
        autoSync: true,
        sorters: [
                  {
                      property : 'level_order',
                      direction: 'ASC'
                  },{
                      property : 'id',
                      direction: 'ASC'
                  }
              ],
		autosort:true
    },

   
    listeners: { 
        exception: function(){ 
          console.log('store exception'); 
        } 
    }
});