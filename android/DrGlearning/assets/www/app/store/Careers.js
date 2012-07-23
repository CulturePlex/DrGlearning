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

        Ext.define('DrGlearning.store.Careers', {
            extend  : 'Ext.data.Store',
            requires: ['DrGlearning.model.Career'],
            config: {
                model: 'DrGlearning.model.Career',
                autoLoad: true,
                autoSync: true
                /*sorters: [
                    {
                        property : 'name',
                        direction: 'DESC'
                    },
                ],*/
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
