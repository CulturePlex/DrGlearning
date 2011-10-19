aplic.views.AvistamientosView = Ext.extend(Ext.Panel, {
	fullscreen: true,
	layout: 'card',

	cardSwitchAnimation: 'slide',
	initComponent: function() {
		//put instances of cards into app.views namespace
		Ext.apply(aplic.views, {
			avistamientosList: new aplic.views.AvistamientosList(),
			avistamientosNew: new aplic.views.AvistamientosNew(),
			avistamientosSelAve: new aplic.views.AvistamientosSelAve(),
			avistamientosSelAveEdit: new aplic.views.AvistamientosSelAveEdit(),
			avistamientosEdit: new aplic.views.AvistamientosEdit(),
			avistamientoDetailMarco: new aplic.views.AvistamientoDetailMarco(),
			mapaEdit: new aplic.views.MapaEdit(),
			//mapaNew: new aplic.views.MapaNew(),

		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [
			aplic.views.avistamientosList,
			aplic.views.avistamientosSelAveEdit,
			aplic.views.avistamientosSelAve,
			aplic.views.avistamientosNew,
			aplic.views.avistamientosEdit,
			aplic.views.avistamientoDetailMarco,
			aplic.views.mapaEdit,
			//aplic.views.mapaNew,

			]
		});
		aplic.views.AvistamientosView.superclass.initComponent.apply(this, arguments);
	}
});