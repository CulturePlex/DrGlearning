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

        Ext.define('DrGlearning.view.CareerDescription', {
            extend: 'Ext.Component',
            xtype: 'careerdescription',
            requires: ['Ext.XTemplate'],
            config: {
                cls: 'card',
                styleHtmlContent: true,
                tpl: Ext.create('Ext.XTemplate',
                    "<p font-size:'18' >{description}</p>"
                )
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
