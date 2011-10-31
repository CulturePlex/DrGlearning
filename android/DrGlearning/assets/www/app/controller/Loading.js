/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 * 
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('DrGlearning.controller.Loading', {
    extend: 'Ext.app.Controller',
    //requires: 'DrGlearning.store.Careers',
	
	views : [
	        'Loading'	,
		],
		
	stores: [
        'Careers'
    ],
	
	init: function(){
		this.getLoadingView().create();
		
	},
	onLaunch: function() {
		console.log("lanzada");
		//if(navigator.network.connection.type==Connection.NONE){
			//logica de desconexion
		//}else{
			var careersStore = this.getCareersStore();
	        careersStore.load({
	            scope   : this,
	            callback: function(records, operation, success) {
	            	console.log("Cargada");
	        		console.log(this.getCareersStore().data.items[0].data.activities);
	        		this.getController('Careers').getMainBuenaView();
	            }
	        });
		//}
    },

});