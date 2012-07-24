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

        Ext.define('DrGlearning.view.CareersListEmpty', {
            extend: 'Ext.Panel',
            xtype: 'careerslistempty',
            items:
            [
                {
                    xtype: 'button',
                    text: ''
                }
            ]
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
