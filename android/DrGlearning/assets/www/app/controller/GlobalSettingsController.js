/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

Ext.define('DrGlearning.controller.GlobalSettingsController', {
    extend: 'Ext.app.Controller',
	init: function(){
	},
	onLaunch: function() {
	},
	getServerURL: function() {
		//return 'http://drglearning.testing.cultureplex.ca';
		return 'http://beta.drglearning.com';
	},
	isDevice: function() {
		if(window.device == undefined){
			return false;
		}else{
			return true;
		}
	},
	hasNetwork: function() {
		//console.log(this.isDevice());
		//console.log(navigator.network);
		if(!this.isDevice() ||  (navigator.network != undefined  && navigator.network.connection.type!=Connection.NONE)){
			return true;
		}else{
			return false;
		}
	}
});