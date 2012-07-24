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
                        direction: 'ASC'
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
