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

        Ext.define('DrGlearning.model.User', {
            extend: 'Ext.data.Model',
            config: {
                fields: [
                    {
                        name: "id",
                        type: "string"
                    }, {
                        name: "display_name",
                        type: "string"
                    }, {
                        name: "email",
                        type: "string"
                    }, {
                        name: "image",
                        type: "string"
                    }, {
                        name: "resource_uri",
                        type: "string"
                    }, {
                        name: "token",
                        type: "string"
                    }, {
                        name: "uniqueid",
                        type: "string"
                    }, {
                        name: "serverid",
                        type: "string"
                    }, {
                        name: "options",
                        type: "object"
                    }
                ],
                proxy: {
                    type: 'localstorage',
                    id  : 'DrGlearningUser'
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
