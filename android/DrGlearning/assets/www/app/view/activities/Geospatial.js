Ext.define('DrGlearning.view.activities.Geospatial', {
    
    extend: 'Ext.Panel',
    xtype : 'geospatial',
	poligono: null,
    marker:null,
	circle:null,
	bandera:null,
	listeners: {
        show: function(){
			console.log('asd');
		}

    },
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
						id: 'confirm',
						customId:'confirm'
                    }
				]
			}
		]
    }
	
	
});