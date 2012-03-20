Ext.define('DrGlearning.view.activities.Temporal', {
    
    extend: 'Ext.Panel',
    xtype : 'temporal',
	config: {
        layout: 'fit',
		id:'activity',
		customId:'activity',
        fullscreen: true,
        items: [{
            xtype: 'panel',
            id: 'image',
        	},
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'neutral',
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