//Controlador de los avistamientos

aplic.controllers.avistamientos = new Ext.Controller({
	//Variable utilizada para recorrer el store con anterior y siguiente
	currentItem : null,
	currentItemIndex: null,
	//Variable utilizada para saber en cual de las dos vistas de avistamiento estamos para que podamos recorrer el store con anterior y siguiente con transiciones
	oddView : null,
	//La siguiente vista a la que hay que actualizarle el record y activar para recorrer con anterior siguiente el store con transiciones
	nextView: null,
	//Pajaro seleccionado para asignarlo a un avistamiento
	seleccionado: null,
	//Variable para almacenar la fecha del datetimepicker temporalmente
	fechaTemp:null,
	//
	//Llama a la vista avistamientosList que muestra todos los avistamientos sin filtrar
	index: function(options) {
		aplic.stores.avistamientos.clearFilter();
		aplic.stores.avistamientos.sort();
		aplic.stores.birds.clearFilter();
		aplic.stores.birds.sort();
		//Asignamos a cada avistamientos su campo nombreAve con el string correspondiente que nos traemos de el store de birds, para poder mostrarlo en la lista
		aplic.stores.avistamientos.each( function(a) {

			seleccionado=a.get("idAve");
			console.log(seleccionado);
			var pajaro = aplic.stores.birds.findRecord("id",seleccionado);
			console.log(pajaro);
			a.set({

				nombreAve: pajaro.get('name'),

			});
		});
		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosList, options.animation
		);

		aplic.views.viewport.setActiveItem(
		aplic.views.avistamientosView
		);

	},
	//Llama a la lista de pajaros para seleccionar un ave en un avistamiento nuevo
	seleccionarave: function(options) {

		aplic.stores.birds.clearFilter();
		aplic.stores.birds.sort();
		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosSelAve, options.animation
		);

	},
	//Llama a la lista de pajaros para seleccionar un ave al modificar un avistamiento existente
	seleccionaraveEdit: function(options) {

		aplic.stores.birds.clearFilter();
		aplic.stores.birds.sort();

		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosSelAveEdit, options.animation
		);

	},
	//Vuelve al editor de nuevo avistamiento con el ave seleccionado y lo asigna en el formulario.
	aveSeleccionado: function(options) {

		index=options.index;
		var pajaro = aplic.stores.birds.getAt(index);
		console.log(pajaro);
		aplic.views.avistamientosNew.setValues({

			idAve: pajaro.get('id'),
			nombreAve: pajaro.get('name'),
			nombreAveLatin: pajaro.get('latin'),
			imagenAve: pajaro.get('imagen')

		});
		console.log(aplic.views.avistamientosNew);
		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosNew, options.animation
		);

	},
	//Vuelve al editor de avistamiento con el ave seleccionado y lo asigna en el formulario.
	aveSeleccionadoEdit: function(options) {

		index=options.index;
		var pajaro = aplic.stores.birds.getAt(index);
		aplic.views.avistamientosEdit.setValues({

			idAve: pajaro.get('id'),
			nombreAve: pajaro.get('name'),
			nombreAveLatin: pajaro.get('latin'),
			imagenAve: pajaro.get('imagen')

		});
		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosEdit, options.animation
		);

	},

	//Abre la vista para editar un avistamiento y rellena los campos con los valores del avistamiento seleccionado
	edit: function(options) {
		
		aplic.controllers.dateTimePicker = new aplic.controllers.DateTimePicker({
			useTitles: true,
			id:'db',
			value: {
				day: 23,
				month: 2,
				year: 2001,
				
			},
			listeners: {
				"cancel": function(picker) {
					
					picker.cancelado=true;
				},
				"hide": function(picker) {
					
					if (picker.cancelado==false)
					{
						
						aplic.views.avistamientosEdit.setValues({
							fecha:picker.getValue()
						});
						aplic.controllers.avistamientos.fechaTemp=picker.getValue();
					}
					if (picker.cancelado==true)
					{
						picker.setValue(aplic.controllers.avistamientos.fechaTemp);
						//aplic.controllers.dateTimePicker.show();
						console.log(picker.getValue());
											 											
					}
					picker.cancelado=false;
				}
			}
		});
		var avistamiento = aplic.stores.avistamientos.actual;
		aplic.controllers.avistamientos.fechaTemp=avistamiento.get('fecha');
		aplic.controllers.dateTimePicker.setFecha(avistamiento.get('fecha'));
		aplic.controllers.dateTimePicker.show();
 		aplic.controllers.dateTimePicker.hide();
 		aplic.views.avistamientosEdit.loadRecord(avistamiento);

		if (avistamiento) {
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosEdit, options.animation
			);
			aplic.views.viewport.setActiveItem(
			aplic.views.avistamientosView
			);
		}

	},
	//Abre la vista del mapa centrado en el marcador creado a partir de los campos del formulario
	abrirMapa: function(options) {
		if( typeof(google) != "undefined" && typeof(google.maps) != "undefined" )
		{
			aplic.views.mapaEdit.enedit = options.edit;
			if(aplic.views.mapView.marker) {
				aplic.views.mapView.marker.setMap(null);
			}
			var pos;
			if(aplic.views.mapaEdit.enedit) {
				pos = new google.maps.LatLng( aplic.views.avistamientosEdit.getValues().lugarx, aplic.views.avistamientosEdit.getValues().lugary);
			} else {
				pos = new google.maps.LatLng( aplic.views.avistamientosNew.getValues().lugarx, aplic.views.avistamientosNew.getValues().lugary);
			}
	
			aplic.views.mapView.marker = new google.maps.Marker({
				map: aplic.views.mapView.map,
				position: pos,
				flat:true
			});
	
			var avistamiento = aplic.stores.avistamientos.actual;
	
			aplic.views.mapView.centrar();
	
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.mapaEdit, options.animation
			)
		}
		else
		{
			Ext.Msg.alert('Error', 'No se puede conectar con Google Maps, compruebe su conexión a Internet.', Ext.emptyFn);
		}

	},
	//Borra el avistamiento determinado
	borrar: function(options) {

		var avistamiento = aplic.stores.avistamientos.actual;
		console.log(avistamiento);
		aplic.stores.avistamientos.remove(avistamiento);
		aplic.stores.avistamientos.sync();

		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosList, options.animation
		);
		aplic.views.viewport.setActiveItem(
		aplic.views.avistamientosView
		);

	},
	//Crea un nuevo avistamiento y te rellena los campos de posicion y fecha del formulario automaticamente, tambien lo asocia con un nuevo record
	nuevo: function(options) {

		aplic.views.avistamientosNew.reset();

		navigator.geolocation.getCurrentPosition(getCoordenadas, noSePudo);
		var latitud;
		var longitud;
		aplic.controllers.dateTimePicker1 = new aplic.controllers.DateTimePicker({
			useTitles: true,
			id:'db',
			value: {
				day: 23,
				month: 2,
				year: 2001,
				
			},
			listeners: {
				"cancel": function(picker) {
					console.log("kaka");
					picker.cancelado=true;
				},
				"hide": function(picker) {
					
					if (picker.cancelado==false)
					{
						
						aplic.views.avistamientosNew.setValues({
							fecha:picker.getValue()
						});
						aplic.controllers.avistamientos.fechaTemp=picker.getValue();
					}
					if (picker.cancelado==true)
					{
						aplic.controllers.avistamientos.fechaTemp=picker.getValue();
					
											 											
					}
					picker.cancelado=false;
				}
			}
		});
 		aplic.controllers.dateTimePicker1.horaActual();
 		aplic.controllers.avistamientos.fechaTemp=aplic.controllers.dateTimePicker1.getValue();
 		aplic.controllers.dateTimePicker1.show();
 		aplic.controllers.dateTimePicker1.hide();
 		console.log("antes:  "+	aplic.controllers.dateTimePicker1.getValue());
		function getCoordenadas(pos) {
			console.log(pos);
			//Obtenemos la longitud y latitud actual
			var ahora=new Date();
			
			
			var record =  Ext.ModelMgr.create({
				lugarx: pos.coords.latitude,
				lugary: pos.coords.longitude,
				fecha: ahora

			}, 'aplic.models.Avistamiento');

			aplic.views.avistamientosNew.updateWithRecord(record);
			aplic.stores.avistamientos.actual=record;
		}

		function noSePudo() {
			console.log("noool");

		}

		

		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosNew, options.animation
		);
		aplic.views.viewport.setActiveItem(
		aplic.views.avistamientosView
		);

	},
	//Crea un nuevo avistamiento y te rellena los campos de posicion y fecha del formulario automaticamente, y el tipo de ave segun el que hayas seleccionado.Tambien lo asocia con un nuevo record
	nuevocontipo: function(options) {
		aplic.views.avistamientosNew.reset();
		//Intenta obtener el posicionamiento del usuario, si lo consigue-> getCoordenadas , si no .-> noSe Pudo.
		navigator.geolocation.getCurrentPosition(getCoordenadas, noSePudo);
		var latitud;
		var longitud;
		aplic.controllers.dateTimePicker1 = new aplic.controllers.DateTimePicker({
			useTitles: true,
			id:'db',
			value: {
				day: 23,
				month: 2,
				year: 2001,
				
			},
			listeners: {
				"cancel": function(picker) {
					console.log("kaka");
					picker.cancelado=true;
				},
				"hide": function(picker) {
					
					if (picker.cancelado==false)
					{
						
						aplic.views.avistamientosNew.setValues({
							fecha:picker.getValue()
						});
						aplic.controllers.avistamientos.fechaTemp=picker.getValue();
					}
					if (picker.cancelado==true)
					{
						aplic.controllers.avistamientos.fechaTemp=picker.getValue();
					
											 											
					}
					picker.cancelado=false;
				}
			}
		});
		aplic.controllers.dateTimePicker1.horaActual();
		function getCoordenadas(pos) {
			aplic.views.mapView.latitud = pos.coords.latitude;
			aplic.views.mapView.longitud = pos.coords.longitude;
			var ahora=new Date();

			var bird = aplic.stores.birds.data.getAt(aplic.controllers.birds.currentItemIndex);

			var record =  Ext.ModelMgr.create({
				idAve: bird.data.id,
				lugarx: pos.coords.latitude,
				lugary: pos.coords.longitude,
				fecha: ahora

			}, 'aplic.models.Avistamiento');
			aplic.stores.avistamientos.actual=record;
			aplic.views.avistamientosNew.updateWithRecord(record);

			aplic.views.avistamientosNew.setValues({
				nombreAve: bird.get('name'),
				nombreAveLatin: bird.get('latin'),
				imagenAve: bird.get('imagen')

			});

		}

		function noSePudo() {
			console.log("Error Obteniendo coordenadas...");

		}

		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosNew, options.animation
		);
		aplic.views.viewport.setActiveItem(
		aplic.views.avistamientosView
		);

	},
	//Salva la edicion de un avistamiento
	salvar: function(options) {

		var avistamiento = aplic.stores.avistamientos.actual;
		aplic.stores.avistamientos.remove(avistamiento);

		var record = Ext.ModelMgr.create(aplic.views.avistamientosEdit.getValues(), 'aplic.models.Avistamiento');
		record.data.fecha=this.fechaTemp;
		
		if(record.data.lugar=="")
		{
			
			record.data.lugar="Lugar sin nombre"
		}
		if(record) {
			aplic.stores.avistamientos.add(record);
			aplic.stores.avistamientos.sync();
		}
		aplic.views.avistamientosView.setActiveItem(
		aplic.views.avistamientosList, options.animation
		);

	},
	//Salvando el mapa de un avistamiento

	salvarmapa: function(options) {
		console.log("en salvar mapa "+aplic.views.mapaEdit.enedit);
		//Comprobamos si veniamos de un edit o un new avistamiento
		if(aplic.views.mapaEdit.enedit) {
			//salvamos en el formulario las coordenadas del marker
			aplic.views.avistamientosEdit.setValues({
				lugarx:aplic.views.mapView.marker.position.lat(),
				lugary:aplic.views.mapView.marker.position.lng()
			});
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosEdit, options.animation
			)
		} else {
			//salvamos en el formulario las coordenadas del marker
			aplic.views.avistamientosNew.setValues({
				lugarx:aplic.views.mapView.marker.position.lat(),
				lugary:aplic.views.mapView.marker.position.lng()
			});
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosNew, options.animation
			)
		}

	},
	//Saliendo del mapa de un avistamiento sin guardar cambios, solo cambiamos la vista
	salirmapa: function(options) {
		console.log("en salir mapa "+aplic.views.mapaEdit.enedit);
		if(aplic.views.mapaEdit.enedit) {
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosEdit, options.animation
			)
		} else {
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosNew, options.animation
			)
		}

	},
	/*nuevomapa: function(options) {

	 aplic.views.avistamientosView.setActiveItem(
	 aplic.views.avistamientosNew, options.animation
	 )

	 },*/

	volveradetail: function(options) {
		aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosDetailMarco, options.animation
		);
		aplic.views.avistamientoDetailMarco.setActiveItem(
			this.nextView, options.animation
		)

	},
	//Salva un avistamiento nuevo
	salvarnuevo: function(options) {

		this.currentItem = Ext.ModelMgr.create(aplic.views.avistamientosNew.getValues(), 'aplic.models.Avistamiento');
		console.log("wewe"+this.fechaTemp);
		
		aplic.controllers.avistamientos.fechaTemp=aplic.controllers.dateTimePicker1.getValue();
		this.currentItem.data.fecha=this.fechaTemp;
		console.log("wewe"+this.currentItem.data.fecha);
		if(this.currentItem.data.lugar=="")
		{
			
			this.currentItem.data.lugar="Lugar sin nombre"
		}
		var errors = this.currentItem.validate(),message = "";
		console.log(errors);

		if(errors.isValid()) {

			console.log("lo que vamos a meter:"),
			console.log(this.currentItem);
			aplic.stores.avistamientos.add(this.currentItem);
			aplic.stores.avistamientos.sync();

			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientosList, options.animation
			);
			//errors=null;
		} else {
			Ext.each(errors.items, function(rec,i) {
				message += rec.message+"<br>";
			});
			Ext.Msg.alert("Error", message, function() {
			});
			//errors=null;
			return false;
		}

		//var errors = this.currentItem.validate();

	},
	/**
	 * Muestra la vista asociada
	 * @param options
	 *
	 */
	//Muestra el avistamiento seleccionado
	show: function(options) {
		if(this.oddView==0) {
			this.nextView = aplic.views.avistamientoDetail;
			this.oddView=1;
		} else {
			this.oddView=0;
			this.nextView = aplic.views.avistamientoDetailOdd;
		}
		var avistamiento;
		var id = parseInt(options.id);
		// Comprobamos si el id es null, y miramos a ver si nos viene el index
		if(!id && options.index !=null) {
			avistamiento = aplic.stores.avistamientos.getAt(options.index);
		} else {
			avistamiento = aplic.stores.avistamientos.getById(id);
		}
		if(options.record) {
			avistamiento=options.record;
		}
		console.log("avistamiento");
		console.log(avistamiento);
		if (avistamiento) {
			aplic.stores.avistamientos.actual=avistamiento;
			var data = avistamiento.data;
			var bird = aplic.stores.birds.findRecord("id",data.idAve);

			if(bird) {
				data.nombreAve=bird.get('name');
				data.nombreAveLatin=bird.get('latin');
				data.imagenAve= bird.get('imagen');
			}

			this.nextView.updateWithRecord(data);
			this.nextView.doLayout();
			aplic.views.avistamientosView.setActiveItem(
			aplic.views.avistamientoDetailMarco, options.animation
			);
			aplic.views.avistamientoDetailMarco.setActiveItem(
			this.nextView, options.animation
			);

		}
	},
	//Muestra el avistamiento anterior
	ant: function(options) {

		if(this.oddView==0) {
			this.nextView = aplic.views.avistamientoDetail;
			this.oddView=1;
		} else {
			this.oddView=0;
			this.nextView = aplic.views.avistamientoDetailOdd;
		}
		console.log("Odd vale :" + this.oddView);
		this.currentItemIndex--;
		console.log("current vale :" + this.currentItemIndex);
		var avist = aplic.stores.avistamientos.data.getAt(this.currentItemIndex);

		if(!avist) {

			avist = aplic.stores.avistamientos.data.last();

		}

		if (avist) {
			aplic.stores.avistamientos.actual=avist;
			var data = avist.data;
			var bird = aplic.stores.birds.findRecord("id",data.idAve);

			if(bird) {
				data.nombreAve=bird.get('name');
				data.nombreAveLatin=bird.get('latin');
				data.imagenAve= bird.get('imagen');
			}
			this.nextView.updateWithRecord(data);
			this.nextView.doLayout();
			this.currentItemIndex = aplic.stores.avistamientos.data.indexOf(avist);

			aplic.views.avistamientoDetailMarco.setActiveItem(
			this.nextView, options.animation
			);
		}
	},
	//Muestra el avistamiento siguiente
	sig: function(options) {
		//Para saber en cuál de las dos vistas estamos (una par y otra impar, para poder ir haciendo las transiciones)
		if(this.oddView==0) {
			this.nextView = aplic.views.avistamientoDetail;
			this.oddView=1;
		} else {
			this.oddView=0;
			this.nextView = aplic.views.avistamientoDetailOdd;
		}
		console.log("Odd vale :" + this.oddView);
		this.currentItemIndex++;
		console.log("current vale :" + this.currentItemIndex);
		var avist = aplic.stores.avistamientos.data.getAt(this.currentItemIndex);
		//si era el último
		if(!avist) {

			avist = aplic.stores.avistamientos.data.first();

		}

		if (avist) {
			aplic.stores.avistamientos.actual=avist;
			var data = avist.data;
			var bird = aplic.stores.birds.findRecord("id",data.idAve);

			if(bird) {
				data.nombreAve=bird.get('name');
				data.nombreAveLatin=bird.get('latin');
				data.imagenAve= bird.get('imagen');
			}
			this.nextView.updateWithRecord(data);
			this.nextView.doLayout();
			this.currentItemIndex = aplic.stores.avistamientos.data.indexOf(avist);

			aplic.views.avistamientoDetailMarco.setActiveItem(
			this.nextView, options.animation
			);
		}
	},
	//Busca un avistamiento con la barra de buscar
	busca: function(options) {

		console.log(options.cadena);
		aplic.stores.birds.clearFilter();
		console.log('Longitud data antes de filtro: ' + aplic.stores.birds.data.length);
		aplic.stores.birds.filterBy( function (o,k) {
			var temp=false;
			if( (o.data.name.toLowerCase().indexOf(options.cadena) != -1) || (o.data.latin.toLowerCase().indexOf(options.cadena) != -1) || (o.data.texto.toLowerCase().indexOf(options.cadena) != -1)) {
				temp=true;

			}
			return temp;
		});
		console.log('Longitud data despues de filtro: ' + aplic.stores.birds.data.length);
		aplic.views.birdsMarco.setActiveItem(
		aplic.views.birdsList, options.animation
		);

	},
	//Ordena la lista de avistamientos
	ordenarpor: function(options) {

		if(options.valor=="especie") {
		

			aplic.views.avistamientosList.orden = 0;
			aplic.views.avistamientosList.items.items[0].setGrouped(true);
			aplic.stores.avistamientos.setGroupingString('nombreAveLatin');
			aplic.stores.avistamientos.sort([{
				property:'nombreAveLatin',
				direction:"ASC"
			}]);


		}
		if(options.valor=="lugar") {
			aplic.views.avistamientosList.orden = 1;
			aplic.views.avistamientosList.items.items[0].setGrouped(true);
			aplic.stores.avistamientos.setGroupingString('lugar');
			aplic.stores.avistamientos.sort([{
				property:'lugar',
				direction:"ASC"
			}]);
			
		}
		if(options.valor=="fecha") {
			aplic.views.avistamientosList.orden = 2;
			aplic.views.avistamientosList.items.items[0].setGrouped(false);
			//aplic.views.avistamientosList.items.items[0].indexBar=false,
			aplic.stores.avistamientos.sort([{
				property:'fecha',
				direction:"ASC"
			}]);
			//aplic.views.avistamientosList.items.items[0].refresh();
			
		}

		
		
		
		aplic.views.avistamientosList.doLayout();
	}
});