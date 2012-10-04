/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace
*/



/*
COMUNES:
-name: El nombre de la actividad
-activity_type: El tipo. De momento las opciones son "geospatial", "linguistic", "relational", "temporal", "visual"
-id: El id de la actividad
-language_code: El lenguaje ("en", "es", ...)
-levels: La lista de los levels asociados a esta actividad
-query: Lo que se pregunta
-timestamp: Sistema de versionado (p. ej. "2011-10-26T13:15:13.556255")
-resource_uri: La uri de la actividad que estamos viendo.
-activity_ptr: Esto es interno de tastypie. Ignorarlo. Aun así, el valor que tiene es el mismo que name.
 
 */

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.model.OfflineScore', {
            extend : 'Ext.data.Model',
            config : {
                fields : [ {
                    name : "id",
                    type : "int"
                }, {
                    name : "activity_id",
                    type : "string"
                }, {
                    name : "score",
                    type : "string"
                }, {
                    name : "is_passed",
                    type : "boolean"
                }, {
                    name : "timestamp",
                    type : "string"
                } ],
                proxy : {
                    type : 'localstorage',
                    id : 'DrGlearningOfflineScore'
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
