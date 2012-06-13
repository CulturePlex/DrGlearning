try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.store.OfflineScores', {
            extend  : 'Ext.data.Store',
            requires: ['DrGlearning.model.OfflineScore'],
            config: {
                model: 'DrGlearning.model.OfflineScore',
                autoLoad: true,
                autoSync: true,
            },
            listeners: { 
                exception: function(){ 
                  console.log('store exception'); 
                } 
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
