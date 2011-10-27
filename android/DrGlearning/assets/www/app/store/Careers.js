Ext.define('DrGlearning.store.Careers', {
    extend  : 'Ext.data.Store',
    model   : 'DrGlearning.model.Career',
    requires: ['DrGlearning.model.Career'],
    
    autoLoad    : true,
    remoteFilter: true
});