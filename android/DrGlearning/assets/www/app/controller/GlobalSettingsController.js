Ext.define('DrGlearning.controller.GlobalSettingsController', {
    extend: 'Ext.app.Controller',
	init: function(){
	},
	onLaunch: function() {
	},
	getServerURL: function() {
		//return 'http://drglearning.testing.cultureplex.ca';
		return 'http://beta.drglearning.ca:8680';
	},
});