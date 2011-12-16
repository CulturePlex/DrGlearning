Ext.define('DrGlearning.view.activities.Linguistic', {
    
    extend: 'Ext.Panel',
    xtype : 'linguistic',
    config: {
        layout: 'fit',
		id:'activity',
		customId:'activity',
        fullscreen: true,
        items: [{
            xtype: 'panel',
            customId: 'image',
            layout: 'fit',
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
						action: 'index'
					},
					{
						 xtype: 'spacer' 
					},{
						xtype: 'button',
						customId: 'solve',
						text: 'Solve',
					},
					]
                
            },{
				xtype: 'toolbar',
                docked: 'bottom',
                ui: 'gray',
                items:[
                    {
		                xtype: 'textfield',
		                docked: 'bottom',
						customId: 'letter',
						name: 'letter',
		                title: 'Error'
		            },
					{
						 xtype: 'spacer' 
					},{
		                xtype: 'label',
		                docked: 'bottom',
						customId: 'loqued',
		            }
				]
			}
			
		]
    },
	
	
});