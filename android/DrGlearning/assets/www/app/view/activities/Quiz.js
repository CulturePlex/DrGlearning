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
			margin: '10 10 5 10',
			centered:true,
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
						text: i18n.gettext('Back'),
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
				margin: '5 10 10 10',
				minHeight:100,
				maxHeight:200,
				scrollable: {
                    direction: 'vertical',
                    directionLock: true
                },
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
