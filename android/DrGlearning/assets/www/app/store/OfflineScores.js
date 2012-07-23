/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace console
*/ 


try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.store.OfflineScores', {
            extend  : 'Ext.data.Store',
            requires: ['DrGlearning.model.OfflineScore'],
            config: {
                model: 'DrGlearning.model.OfflineScore',
                autoLoad: true,
                autoSync: true
            },
            listeners: { 
                exception: function () { 
                    console.log('store exception'); 
                } 
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
