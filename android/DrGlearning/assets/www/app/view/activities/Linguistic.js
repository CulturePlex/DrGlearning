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

        Ext.define('DrGlearning.view.activities.Linguistic', {

            extend: 'Ext.Panel',
            xtype: 'linguistic',
            config: {
                id: 'activity',
                customId: 'activity',
                fullscreen: true,
                scrollable: true,
                layout: 'vbox',
                items: [
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'neutral',
                        customId: 'query',
                        layout: {
                            type: 'hbox',
                            pack : 'center' 
                        }
                    },
                    {
                        xtype: 'panel',
                        id: 'image',
                        customId: 'image',
                        margin: 10
                    }, {
                        xtype: 'container',
   						layout: {
                            type: 'hbox',
                            pack : 'center' 
                        },
                        items: 
                        [
                            {
                                xtype: 'label',
                                html: 'TIP: ',
                                customId: 'tip',
                                margin: 10
                            }, {
                                xtype: 'label',
                                customId: 'loqued',
                                margin: 10
                            }
                        ]
                    }, {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'textfield',
                                customId: 'letter',
                                name: 'letter',
                                maxLength: 1,
                                margin: 10,
                                flex: 2
                            }, {
                                xtype: 'button',
                                customId: 'try',
                                text: i18n.gettext('Try'),
                                ui: 'small',
                                flex: 1,
                                margin: 10
                            }
                        ]
                    },
                    {
					xtype: 'container',
					layout: {
                        type: 'hbox',
                        pack : 'center' 
                    },
					items: {
                        xtype: 'label',
                        customId: 'responses',
                        margin: 10,
                    },
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
                            }, 
                            {
                                xtype: 'button',
                                customId: 'solve',
                                text: i18n.gettext('Solve')
                            }
                        ]
                    }
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
