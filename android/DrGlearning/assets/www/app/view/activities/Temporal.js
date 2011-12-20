Ext.define('DrGlearning.view.activities.Temporal', {
    
    extend: 'Ext.Panel',
    xtype : 'temporal',
	config: {
        layout: 'fit',
		id:'activity',
		customId:'activity',
        fullscreen: true,
        items: [{
            xtype: 'image',
            customId: 'image',
            layout: 'fit',
            fullscreen: true
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
                ui: 'gray',
                items:[
                    {
						xtype: 'button',
						customId: 'backtolevel',
						id: 'backtolevel',
						text: 'Back',
						ui: 'back',
					},
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: 'Before',
						customId: 'before',
						ui: 'normal',
                    },
					{
                        xtype: 'button',
                        text: 'After',
						customId: 'after',
						ui: 'normal',
                    }]
                
            }
		]
    },
	
	
});