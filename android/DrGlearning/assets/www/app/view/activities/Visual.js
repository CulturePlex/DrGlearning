Ext.define('DrGlearning.view.activities.Visual', {
    
    extend: 'Ext.Panel',
    xtype : 'visual',
    config: {
        layout: 'fit',
		id:'activity',
		customId:'activity',
        fullscreen: true,
        items: [{
            xtype: 'panel',
            customId: 'image',
        	},
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'gray',
                items:[{
                        xtype: 'label',
						customId: 'query',
						name: 'query',
                        title: 'Error'
                    }
                    ]
                
            },
			{
                xtype: 'toolbar',
                docked: 'bottom',
                items:[
                    {
						xtype: 'button',
						customId: 'backtolevel',
						text: 'Back',
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
                xtype: 'toolbar',
				customId: 'time',
                docked: 'bottom',
				ui:'neutral',
                items:[{
                        xtype: 'label',
						customId: 'time',
						name: 'query',
                        title: 'Error'
                    }
                    ]
                
            }
		]
    },
	
	
});