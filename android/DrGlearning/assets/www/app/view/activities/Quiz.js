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

        Ext.define('DrGlearning.view.activities.Quiz', {
            extend: 'Ext.Panel',
            xtype : 'visual',
            config: {
                id: 'activity',
                customId: 'activity',
                layout: 'fit',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'neutral',
                        customId: 'query',
                        layout: {
                            type: 'hbox',
                            pack : 'center' 
                        },
                        height: 40
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items: [
                            {
                                xtype: 'button',
                                customId: 'backtolevel',
                                text: i18n.gettext('Back'),
                                ui: 'back',
                                controller: 'DrGlearning.controller.Career',
                                action: 'index'
                            },
                            {
                                xtype: 'spacer' 
                            }
                        ]
                    },
                    {
                        xtype: 'container',
                        customId: 'timecontainer',
                        padding: 10,
                        docked: 'bottom'
                    }
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
