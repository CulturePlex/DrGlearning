/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 * 
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('DrGlearning.controller.Careers', {
    extend: 'Ext.app.Controller',
    requires: 'DrGlearning.store.Careers',
	
	views : [
	        'MainBuena'	,
			'CareerDetail',
			'LevelDescription'     
	    ],
		
	stores: [
        'Careers'
    ],
	
	refs: [
        {
            ref     : 'mainbuena',
            selector: 'mainbuenaview',
            autoCreate: true,
            xtype   : 'mainbuenaview'
        },
		{
            ref     : 'careerdetail',
            selector: 'careerdetail',
        }
		],
	init: function(){
		this.getMainBuenaView().create();
		this.control({
			'careerslist': {
				select: this.onListTap
			},
			'careerdetail': {
              
            },
		});
	},
	
	onListTap: function(list, career) {
		console.log("hola");
		if (!this.getCareerdetail()) {
			this.getCareerDetailView().create();
		}
        

        var view = this.getCareerdetail();
        //view.setCareer(career);
        
        view.show();
    },
    onLaunch: function() {
        //var careersStore = this.getCareersStore();
        //console.log(careersStore);
        //careersStore.load();
    }

});


// Ext.regController("loans", {

//     /**
//      * Renders the Viewport and sets up listeners to show details when a Loan is tapped on. This
//      * is only expected to be called once - at application startup. This is initially called inside
//      * the app.js launch function.
//      */
//     list: function() {
//         this.listView = this.render({
//             xtype: 'kivaMain',
//             listeners: {
//                 scope : this,
//                 filter: this.onFilter,
//                 selectionchange: this.onSelected
//             }
//         }, Ext.getBody()).down('.loansList');
//     },

//     /**
//      * Shows a details overlay for a given Loan. This creates a single reusable detailView and simply
//      * updates it each time a Loan is tapped on.
//      */
//     show: function(options) {
//         var view = this.detailView;
        
//         if (!view) {
//             this.detailView = this.render({
//                 xtype: 'loanShow',
//                 listeners: {
//                     scope: this,
//                     hide : function() {
//                         this.listView.getSelectionModel().deselectAll();
//                     }
//                 }
//             }, false);
            
//             view = this.detailView;
//         }
        
//         view.setLoan(options.instance);
//         view.show();
//     },
    
    
//     /**
//      * @private
//      * Causes the Loan details overlay to be shown if there is a Loan selected
//      */
//     onSelected: function(selectionModel, records) {
//         var loan = records[0];
        
//         if (loan) {
//             this.show({
//                 instance: loan
//             });
//         }
//     }
// });