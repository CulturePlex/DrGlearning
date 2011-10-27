aplic.controllers.birds = new Ext.Controller({
	currentItemIndex : null,
	oddView : null,
	nextView: null,
	idFamilia: 0,
	//Muestra la lista de pajaros
	index: function(options) {
		console.log(options.fam); 
		if(options.fam!=null)
		{
			console.log(options.fam); 
			this.idFamilia=options.fam;
		}
		aplic.stores.birds.clearFilter();
		if(this.idFamilia!=0)
		{
			aplic.stores.birds.filter("idFamilia", this.idFamilia);
		}
		
		aplic.stores.birds.sort();
		aplic.views.birdsMarco.limpiabusqueda();
		aplic.views.birdsMarco.doLayout();
		aplic.views.birdsView.setActiveItem(
		aplic.views.birdsMarco, options.animation
		);

		aplic.views.birdsMarco.setActiveItem(
		aplic.views.birdsList, options.animation
		);
		aplic.views.viewport.setActiveItem(
		aplic.views.birdsView, options.animation
		);

	},
	//Muestra los detalles del pajaro seleccionado
	show: function(options) {

		if(this.oddView==0) {
			this.nextView = aplic.views.birdDetail;
			this.oddView=1;
		} else {
			this.oddView=0;
			this.nextView = aplic.views.birdDetailOdd;
		}

		var id = parseInt(options.id);
		var bird = options.record;

		if (bird) {
			this.currentItemIndex = aplic.stores.birds.data.indexOf(bird);
			console.log("current vale :" + this.currentItemIndex);
			this.nextView.updateWithRecord(bird);

			aplic.views.birdsView.setActiveItem(
			aplic.views.birdDetailMarco, options.animation
			);
			aplic.views.birdDetailMarco.setActiveItem(
			this.nextView, options.animation
			);

		}
	},
	//Muestra el pajaro anterior
	ant: function(options) {

		if(this.oddView==0) {
			this.nextView = aplic.views.birdDetail;
			this.oddView=1;
		} else {
			this.oddView=0;
			this.nextView = aplic.views.birdDetailOdd;
		}
		console.log("Odd vale :" + this.oddView);
		this.currentItemIndex--;
		console.log("current vale :" + this.currentItemIndex);
		var bird = aplic.stores.birds.data.getAt(this.currentItemIndex);
		if(!bird) {

			bird = aplic.stores.birds.data.last();

		}

		if (bird) {
			this.currentItemIndex = aplic.stores.birds.data.indexOf(bird);
			this.nextView.updateWithRecord(bird);

			aplic.views.birdDetailMarco.setActiveItem(
			this.nextView, options.animation
			);
		}
	},
	//Muestra el pajaro siguiente
	sig: function(options) {

		if(this.oddView==0) {
			this.nextView = aplic.views.birdDetail;
			this.oddView=1;
		} else {
			this.oddView=0;
			this.nextView = aplic.views.birdDetailOdd;
		}
		console.log("Odd vale :" + this.oddView);
		this.currentItemIndex++;
		var bird = aplic.stores.birds.data.getAt(this.currentItemIndex);
		if(!bird) {
			bird= aplic.stores.birds.data.first();

		}

		if (bird) {
			this.currentItemIndex = aplic.stores.birds.data.indexOf(bird);
			this.nextView.updateWithRecord(bird);
			aplic.views.birdDetailMarco.setActiveItem(
			this.nextView, options.animation
			);
		}
	},
	//Muestra la lista de pajaros filtrada por una familia en concreto
	showFamily: function(options) {
		this.idFamilia=options.id;
		var id = parseInt(options.id);
		console.log(id);
		if (id) {
			aplic.stores.birds.clearFilter();
			aplic.stores.birds.sort();
			console.log('Longitud data antes de filtro: ' + aplic.stores.birds.data.length);
			aplic.stores.birds.filter("idFamilia", id);
			console.log('Longitud data despues de filtro: ' + aplic.stores.birds.data.length);
			aplic.views.birdsMarco.setActiveItem(
			aplic.views.birdsList, options.animation
			);
		}
	},
	//Muestra la lista de las familias
	familias: function(options) {
		aplic.views.birdsMarco.limpiabusqueda();
		aplic.views.birdsMarco.setActiveItem(
		aplic.views.birdsFamilies, options.animation
		);

	},
	//Busca un pajaro en concreto
	busca: function(options) {
		console.log(options.cadena);
		aplic.stores.birds.clearFilter();
	
		aplic.stores.birds.sort();
		console.log('Longitud data antes de filtro: ' + aplic.stores.birds.data.length);
		aplic.stores.birds.filterBy( function (o,k) {
			var temp=false;
			if( (o.data.name.toLowerCase().indexOf(options.cadena) != -1) || (o.data.latin.toLowerCase().indexOf(options.cadena) != -1) ) {
				temp=true;

			}
			return temp;
		});
			if(this.idFamilia!=0)
		{
			aplic.stores.birds.filter("idFamilia", this.idFamilia);
		}
		console.log('Longitud data despues de filtro: ' + aplic.stores.birds.data.length);
		aplic.views.birdsMarco.setActiveItem(
		aplic.views.birdsList, options.animation
		);
		aplic.views.birdsView.setActiveItem(
		aplic.views.birdsMarco, options.animation
		);

	},
	//Ordena la lista de pajaros
	ordenarpor: function(options) {

		if(options.valor=="cientifico") {
		

			aplic.views.birdsList.orden = 1;
			aplic.stores.birds.setGroupingString('latin');
			aplic.stores.birds.sort([{
				property:'latin',
				direction:"ASC"
			}]);


		}
		if(options.valor=="comun") {
			aplic.views.birdsList.orden = 0;
			aplic.stores.birds.setGroupingString('name');
			aplic.stores.birds.sort([{
				property:'name',
				direction:"ASC"
			}]);
			
		}

		
		
		aplic.views.birdsMarco.limpiabusqueda();
		aplic.views.birdsMarco.doLayout();
	}
});