Ext.regApplication({
	name: 'aplic',
	launch: function() {
		this.mainLaunch();

	},
	mainLaunch: function() {
		
		if ( this.launched) {
			return;
		}
		this.launched = true;
		this.views.viewport = new this.views.Viewport();
		

	}
});