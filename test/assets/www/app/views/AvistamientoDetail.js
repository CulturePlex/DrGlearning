aplic.views.AvistamientoDetail = Ext.extend(Ext.Panel, {
	listeners: {
		body: {
			//delegate: '#as', //bind to the underlying el property on the panel
			tap: function(e) {
				
				if(e.target.id=='editar') {
					
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'edit',

						animation: {
							type:'slide',
							direction:'left'
						}
					});
				}
				if(e.target.id=='borrar') {
					Ext.dispatch({
						controller: aplic.controllers.avistamientos,
						action: 'borrar',
						animation: {
							type:'slide',
							direction:'left'
						}
					});
				}
				console.log(e);
				
			}
		}
	},

	scroll: 'vertical',


	items: 
		{

		tpl:[
		'<tpl nombreAveLatin>',
		'<div id="nombrelatin">{nombreAveLatin} </div>',
		'</tpl>',
		'<tpl nombreAve>',
		'<div id="nombreave"><font size=2>{nombreAve} </font></div>',
		'</tpl>',
		'<tpl conteo>',
		'<div id="conteo"><font size=3>Conteo: {conteo} </font></div>',
		'</tpl>',
		'<tpl lugarnombre>',
		'<div id="lugar"  >{lugar}</div>',
		'</tpl>',
		'<tpl descripcion>',
		'<div id="descripcion">{descripcion}</div>',
		'</tpl>',
		'<tpl fecha>',
		'<div id="fecha">{[values.fecha.format("j F, Y, g:i a")]}</div>',
		'</tpl>',
		'<tpl mapa>',
		'<div id="leyendamapa">Ubicación:</div>',
		'<div id="mapa"><IMG id="imgmapa{id}" SRC="img/site_cargando.gif" /></div>',
		'</tpl>',
		'<div id="botones">',
		'<div id="editar"></div>',
		'<div id="borrar"></div>',
		'</div>'
		
		]
	}
	,
	
	updateWithRecord: function(data) {
		Ext.each(this.items.items, function(item) {
			item.update(data);
		})
		var urlmapa = 'http://maps.google.com/maps/api/staticmap?zoom=14&size=290x260&maptype=hybrid&markers=color:blue|label:A|'+data.lugarx+','+data.lugary+'&sensor=false';
		console.log("updating...");
	
		//Comprobamos si se puede acceder a la URL y si no se puede, mostramos una imagen de que no hay internet...
		Ext.Ajax.request({
			method: 'get',
			url: urlmapa,
			success: function(){ Ext.get("imgmapa"+data.id).dom.src = urlmapa ; console.log("TRIUNFO"); },
			failure: function(){  console.log("FALLO"); Ext.get("imgmapa"+data.id).dom.src = 'img/nonet.png';},
			disableCaching: false
		});
		
		
		
			
	},
});