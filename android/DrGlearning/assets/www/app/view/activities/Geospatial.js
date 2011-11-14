Ext.define('DrGlearning.view.activities.Geospatial', {
    
    extend: 'Ext.Panel',
    xtype : 'geospatial',
    marker:null,
	bandera:null,
    config: {
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
                        xtype: 'title',
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
						id: 'backtolevel',
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
    
    initialize: function() {
        this.callParent();
       
        // FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
        var map = Ext.getCmp('testMap').map;
        this.on({
            show: function(){
                google.maps.event.trigger(map, 'resize');
                map.panTo(new google.maps.LatLng(50.71462, 12.496889));
            }
        });
        // FIX: Rendering Problem von Sencha Touch 2.0.0-pr1
		console.log(this);
		google.maps.event.addListener(map, "mouseup", function(e){
				
				// ESTO SOLO DEBE EJECUTARSE SI NO SE HA MOVIDO
				if (this.bandera == true) {
					console.log('Evento en el mapa mousedown');
					if (this.marker) {
						this.marker.setMap(null);
					}
					this.marker = new google.maps.Marker({
						map: map,
						position: e.latLng,
						flat: true
					});
				}
		});
		google.maps.event.addListener(map, "mousemove", function(e){
				console.log('Evento en el mapa mousemove');
				this.bandera=false;
    		
		});
		google.maps.event.addListener(map, "mousedown", function(e){
				this.bandera=true;
				
    		
		});
			
    },
	
	
});