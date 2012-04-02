Ext.define('DrGlearning.view.activities.Visual', {
    
    extend: 'Ext.Panel',
    xtype : 'visual',
    config: {
        layout: 'fit',
		id:'activity',
		customId:'activity',
        fullscreen: true,
        items: [{
            xtype: 'container',
            id: 'image',
			padding: 10,
        	},
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'gray',
				customId: 'query',
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
                xtype: 'container',
				customId: 'time',
                docked: 'bottom',
				ui:'neutral',
				padding: 10,
                items:[{
                        xtype: 'label',
						customId: 'time',
						name: 'query',
                        title: 'Error'
                    },
					{
                        xtype: 'container',
						customId: 'options',
                    }
                    ]
                
            }
		]
    },
	
	
});