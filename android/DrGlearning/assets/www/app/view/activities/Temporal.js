Ext.define('DrGlearning.view.activities.Temporal', {
    
    extend: 'Ext.Panel',
    xtype : 'temporal',
    config: {
        layout: 'fit',
		id:'activity',
        fullscreen: true,
        items: [{
            xtype: 'panel',
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
						text: 'Back',
						ui: 'back',
						controller: 'DrGlearning.controller.Career',
						action: 'index',
					},
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: 'Before',
						customId: 'before'
                        
                    },
					{
                        xtype: 'button',
                        text: 'After',
						customId: 'after'
                        
                    }]
                
            }
		]
    },
	
	
});