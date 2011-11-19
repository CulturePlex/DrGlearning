Ext.define('DrGlearning.view.activities.Geospatial', {
    
    extend: 'Ext.Panel',
    xtype : 'geospatial',
    marker:null,
	circle:null,
	bandera:null,
    config: {
		id:'activity',
        title: 'Map',
        iconCls: 'maps',
        layout: 'fit',
        fullscreen: true,
        items: [{
            xtype: 'map',
            id: 'testMap',
            layout: 'fit',
            fullscreen: true
        	},
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'gray',
                items:[{
                        xtype: 'label',
						id: 'query',
						name: 'query',
                        title: '¿Donde se invento sencha?'
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
    }
	
	
});