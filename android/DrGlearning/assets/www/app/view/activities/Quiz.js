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
                        height:40
                    },
                    {
                        xtype: 'toolbar',
                        docked: 'bottom',
                        items:[
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
                            }]
                    },
                    {
                        xtype: 'container',
                        customId: 'timecontainer',
                        padding:10,
                        docked:'bottom'
                    }
                ]
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
