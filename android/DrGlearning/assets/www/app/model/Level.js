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

        Ext.define('DrGlearning.model.Level', {
            extend : 'Ext.data.Model',
            config : {
                fields : [ {
                    name : "customId",
                    type : "int"
                }, {
                    name : "name",
                    type : "string"
                }, {
                    name : "nameBeauty",
                    type : "string"
                }, {
                    name : "description",
                    type : "string"
                } ]
                /*proxy : {
                    type : 'ajax',
                    url : 'resources/json/levels.json',
                    reader : {
                        type : 'json',
                        rootProperty : 'levels'
                    }
                }*/
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
