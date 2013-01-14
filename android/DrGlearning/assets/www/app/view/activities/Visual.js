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

        Ext.define('DrGlearning.view.activities.Visual', {
            extend: 'Ext.Panel',
            xtype : 'visual',
            config: {
                id: 'activity',
                customId: 'activity',
                fullscreen: true,
                layout: 'fit',
                items: 
                [
                    {
                        xtype: 'container',
                        id: 'image',
                        cls: 'imageBehindButtons'
                    },
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
                        items:
                        [
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
                        docked: 'bottom',
                        items:
                        [
                            {
                                xtype: 'label',
                                style: 'text-align:center',
                                customId: 'time',
                                name: 'query',
                                title: 'Error'
                            },
                            {
                                xtype: 'button',
                                customId: 'skip',
                                text: i18n.gettext('Solve')
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        layout: 'vbox',
                        customId: 'options',
                        cls: 'imageBehindButtons'
                    }
                ]
            }
        });
    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
