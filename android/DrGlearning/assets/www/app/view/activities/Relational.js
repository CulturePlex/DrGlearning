Ext.define('DrGlearning.view.activities.Relational', {
    
    extend: 'Ext.Panel',
    xtype : 'relational',
    config: {
        layout: 'fit',
        fullscreen: true,
        items: [{
            xtype: 'panel',
            id: 'contentSencha',
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
                        title: 'Relational Test'
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
						id: 'backtolevel',
						text: 'Back',
						ui: 'back',
						controller: 'DrGlearning.controller.Career',
						action: 'index',
					},
					{
						 xtype: 'spacer' 
					}]
                
            }
		]
    },
	
	
});