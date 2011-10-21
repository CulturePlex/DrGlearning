aplic.controllers.careers = new Ext.Controller({
	index: function(options) {
		aplic.views.viewport.setActiveItem(
		aplic.views.careersInstalledView, options.animation
		);

	},
	show: function(options) {

		var id = parseInt(options.id);
		var career = options.career;

		if (career) {
			aplic.views.careerDetail.updateWithRecord(career);

			aplic.views.viewport.setActiveItem(
			aplic.views.careerDetailMarco, options.animation
			);

		}
	}
});