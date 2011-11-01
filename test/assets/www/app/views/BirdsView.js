aplic.views.BirdsView = Ext.extend(Ext.Panel, {
	fullscreen: true,
	layout: 'card',

	cardSwitchAnimation: 'slide',
	initComponent: function() {
		//put instances of cards into app.views namespace
		Ext.apply(aplic.views, {
			birdDetailMarco: new aplic.views.BirdDetailMarco(),
			birdsMarco: new aplic.views.BirdsMarco(),

		});

		//put instances of cards into viewport
		Ext.apply(this, {
			items: [
			aplic.views.birdsMarco,
			aplic.views.birdDetailMarco,

			]
		});
		console.log('Dentro de DogView : ' + aplic.views);
		aplic.views.BirdsView.superclass.initComponent.apply(this, arguments);
	}
});