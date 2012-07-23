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

        Ext.define('DrGlearning.view.activities.Relational', {

            extend : 'Ext.Container',
            xtype : 'relational',
            customId: 'activity',
            padding: 10,
            config : {
                id: 'activity',
                customId: 'activity',
                layout : {
                    type: 'vbox'
                },
                fullscreen : true,
                scrollable: true,
                items : 
                [ 
                    {
                        xtype : 'panel',
                        id : 'contentSencha',
                        customId : 'contentSencha'
                    }, 
                    {
                        xtype: 'toolbar',
                        docked: 'top',
                        ui: 'neutral',
                        customId: 'query',
                        layout: 
                        {
                            type: 'hbox'
                        },
                        width: '100%',
                        height: 40
                    },
                    {
                        xtype : 'toolbar',
                        docked : 'bottom',
                        items : 
                        [ 
                            {
                                xtype : 'button',
                                text : i18n.gettext('Back'),
                                ui : 'back',
                                customId: 'backtolevel',
                                controller : 'DrGlearning.controller.Career',
                                action : 'index'
                            }, {
                                xtype : 'spacer'
                            } 
                        ]
                    },
                    {
                        xtype : 'toolbar',
                        docked : 'bottom',
                        ui: 'neutral',
                        customId: 'constraintsbar',
                        defaults: {
                            iconMask: true
                        }
                    },
                    {
                        xtype : 'container',
                        docked : 'bottom',
                        ui: 'neutral',
                        customId: 'scorebar',
                        defaults: {
                            iconMask: true
                        }
                    }
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
