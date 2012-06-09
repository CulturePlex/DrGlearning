Ext.define('DrGlearning.view.activities.Temporal', {
    extend: 'Ext.Panel',
    xtype : 'temporal',
    config: {
        id: 'activity',
        customId: 'activity',
        fullscreen: true,
        scrollable:true,
        layout: 'vbox',
        items: [{
            xtype: 'container',
            id: 'image',
            margin: 10,
            centered:true,

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

                height:40,
                               
            },
            {
                xtype: 'toolbar',
                docked: 'bottom',
                items:[
                    {
                        xtype: 'button',
                        customId: 'backtolevel',
                        id: 'backtolevel',
                        text: i18n.gettext('Back'),
                        ui: 'back',
                    },
                    {
                         xtype: 'spacer' 
                    },
                    {
                        xtype: 'button',
                        text: i18n.gettext('Before'),
                        customId: 'before',
                        ui: 'normal',
                    },
                    {
                        xtype: 'button',
                        text: i18n.gettext('After'),
                        customId: 'after',
                        ui: 'normal',
                    }]
                
            }
        ]
    },
    
    
});
