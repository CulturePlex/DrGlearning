Ext.define('DrGlearning.view.activities.Quiz', {
    
    extend: 'Ext.Panel',
    xtype : 'visual',
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
                xtype: 'container',
                docked: 'top',
                ui: 'neutral',
				customId: 'query',
				layout: {
		            type: 'hbox',
					pack : 'center' 
		        },

				height:60,
                               
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