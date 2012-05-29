Ext.define('DrGlearning.view.activities.Visual', {
    
    extend: 'Ext.Panel',
    xtype : 'visual',
    config: {
        id: 'activity',
        customId: 'activity',
        fullscreen: true,
        layout: 'fit',
        items: [{
            xtype: 'container',
            id: 'image',
			cls:'imageBehindButtons'
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
						text: i18n.gettext('Back'),
						ui: 'back',
						customId: 'backtolevel',
						controller: 'DrGlearning.controller.Career',
						action: 'index',
					},
					{
						 xtype: 'spacer' 
					}]
                
            }
			,
			{
                xtype: 'container',
				padding:10,
				docked:'bottom',
                items:[{
                        xtype: 'label',
						style: 'text-align:center',
						customId: 'time',
						name: 'query',
                        title: 'Error',
                    },
					{
                        xtype: 'button',
						customId:'skip',
						text: i18n.gettext('Skip'),
                    }
                    ]
                
            },
			{
                xtype: 'panel',
                layout: 'vbox',
				customId: 'options',
				cls:'imageBehindButtons'
            }
		]
    },
	
	
});
