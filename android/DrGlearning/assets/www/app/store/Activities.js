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
                        direction: 'DESC'
                    }
                ]
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
