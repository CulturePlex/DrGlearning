Ext.define('DrGlearning.view.activities.Quiz', {
    
    extend: 'Ext.Panel',
    xtype : 'visual',
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
                    }
                    ]
                
            }
		]
    },
	
	
});