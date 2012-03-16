Ext.define('DrGlearning.view.activities.Geospatial', {
    
    extend: 'Ext.Panel',
    xtype : 'geospatial',
	poligono: null,
    marker:null,
	circle:null,
	bandera:null,
    config: {
		customId:'activity',
		id:'activity',
        title: 'Map',
        iconCls: 'maps',
        layout: 'fit',
        fullscreen: true,
        items: [{
            xtype: 'map',
			mapOptions: {
				mapTypeControl: false,
				streetViewControl:false,
				
			}},
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'neutral',
                items:[{
                        xtype: 'label',
						id: 'query',
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
						text: 'Back',
						ui: 'back',
					},
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: 'Confirm',
						id: 'confirm',
						customId:'confirm'
                    }
				]
			}
		]
    }
	
	
});