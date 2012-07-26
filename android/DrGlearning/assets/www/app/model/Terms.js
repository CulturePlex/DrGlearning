/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/



try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.model.Terms', {
            extend : 'Ext.data.Model',
            config : {
                fields : [ {
                    name : "text",
                    type : "auto"
                }]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
