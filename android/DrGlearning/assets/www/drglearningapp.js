Ext.Loader.setConfig({
    enabled: true
});
//Ext.Loader.setPath('Phonegap', 'lib/phonegap');

Ext.application({
    name: 'DrGlearning',
    controllers: ['Loading','Careers'],
    models     : ['Career'],
    stores: ['Careers']

});
