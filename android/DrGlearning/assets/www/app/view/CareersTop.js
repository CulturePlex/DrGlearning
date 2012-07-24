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

        Ext.define('DrGlearning.view.CareersTop', {
            extend: 'Ext.Container',
            xtype: 'careerstop',

            config: {
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'gray',
                        items:
                        [
                            {
                                xtype: 'selectfield',
                                name: 'estado',
                                options: [
                                    {text: i18n.gettext('In progress'), value: 'both'},
                                    {text: i18n.gettext('Not yet started'), value: 'male'}
                                ]
                            },
                            { xtype: 'spacer' },
                            {
                                xtype: 'button',
                                text: i18n.gettext('Add course')
                            }
                        ]
                    }
                ],
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                }
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
