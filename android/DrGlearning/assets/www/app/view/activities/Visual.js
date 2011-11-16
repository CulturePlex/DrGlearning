Ext.define('DrGlearning.view.activities.Visual', {
    
    extend: 'Ext.Panel',
    xtype : 'visual',
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
                        xtype: 'title',
						id: 'query',
						name: 'query',
                        title: 'Pay attention to this image..'
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
                        text: 'Confirm',
						id: 'confirmmapposition'
                        
                    }]
                
            }
		]
    },
	
	
});