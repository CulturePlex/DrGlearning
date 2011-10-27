Mapa = Ext.extend(Ext.form.Field, {
	initComponent: function() {

		Mapa.superclass.initComponent.apply(this, arguments);

	},
	renderTpl: ['Lat: {longName}','Long: {latName}']

});
Ext.reg('mapa', Mapa);