/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 * 
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('DrGlearning.controller.Careers', {
    extend: 'Ext.app.Controller',
	
	views : [
	        'Main'	,
			'CareerFrame',
			'CareersFrame'     
	    ],
		
	stores: [
        'Careers'
    ],
	
	refs: [
        {
            ref     : 'main',
            selector: 'mainview',
            autoCreate: true,
            xtype   : 'mainview'
        },
		{
            ref     : 'careerframe',
            selector: 'careerframe',
			xtype: 'careerframe'
        },
		{
            ref     : 'careersframe',
            selector: 'careersframe',
			xtype: 'careersframe'
        }
		],
	init: function(){
		this.getMainView().create();
		console.log(this.getMainView().create());
		
		this.control({
			'careerslist': {
				select: this.onListTap
			},
			'button[id=back]': {
				tap: this.index
			}
		});
		
		this.getCareersFrameView().create();
		var view = this.getCareersframe();
        //view.setCareer(career);
        view.show();
	},
	index: function(){
		var view = this.getCareerframe();
        //view.setCareer(career);
        view.hide();
		var view1 = this.getCareersframe();
        //view.setCareer(career);
        view1.show();
	},
	
	onListTap: function(list, career) {
	
		this.getCareerFrameView().create();
		var view = this.getCareerframe();
        //view.setCareer(career);
		this.getCareersframe().hide();
        view.show();
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