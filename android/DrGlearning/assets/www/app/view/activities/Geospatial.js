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
			streetViewControl: 'false',
			mapOptions: {
				styleHtmlContent: true,
				streetViewControl:false,
			},
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
                        title: 'Error'
                    }
                    ]
                
            }
			
		]
    }
	
	
});