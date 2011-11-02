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
	        'Main'	,
			'CareerFrame',
			'CareersFrame',
			'LevelFrame'    
	    ],
		
	stores: [
        'Careers'
    ],
	selectedcareer: null,
	
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
            ref     : 'levelframe',
            selector: 'levelframe',
			xtype: 'levelframe'
        },
		{
            ref     : 'careersframe',
            selector: 'careersframe',
			xtype: 'careersframe'
        }
		],
	selectedcareer:null,
	init: function(){
		this.getMainView().create();
		this.control({
			'careerslistitem': {
				tap: this.onListTap
			},
			'button[id=back]': {
				tap: this.index
			},
			'button[id=backtocareer]': {
				tap: this.tocareer
			},
			'button[id=addCareer]': {
				tap: this.addCareer
			},
			'button[id=startLevel]': {
				tap: this.startLevel
			},
			'searchfield[id=searchbox]': {
				change: this.search
			}
		});
		this.getCareersFrameView().create();
		var view = this.getCareersframe();
		view.down('toolbar[id=toolbarTopAdd]').hide();
		view.down('toolbar[id=toolbarBottomAdd]').hide();
		view.show();
	},
	index: function(){
		var view = this.getCareerframe();
		if(view)
		{
        	view.hide();
		}	
		var view1 = this.getCareersframe();
        view1.show();
		view1.down('toolbar[id=toolbarTopNormal]').show();
		view1.down('toolbar[id=toolbarTopAdd]').hide();
		view1.down('toolbar[id=toolbarBottomAdd]').hide();
	},
	tocareer: function(){
		if (this.getCareersframe()) {
			this.getCareersframe().hide();
		}
		if (this.getLevelframe()) {
			this.getLevelframe().hide();
		}
		var view1 = this.getCareerframe();
        view1.show();	
	},
	
	onListTap: function(list, career) {
		this.selectedcareer=career;
		this.getCareerFrameView().create();
		var view = this.getCareerframe();
		view.updateCareer(career);
		this.getCareersframe().hide();
        view.show();
    },
	
	addCareer: function(){
		var view = this.getCareerframe();
        if (view) {
			view.hide();
		}
		var view1 = this.getCareersframe();
		view1.down('toolbar[id=toolbarTopNormal]').hide();
		view1.down('toolbar[id=toolbarTopAdd]').show();
		view1.down('toolbar[id=toolbarBottomAdd]').show();
        view1.show();
	},
	
	startLevel: function(){
		this.getLevelFrameView().create();
		var view = this.getLevelframe();
		console.log(this.selectedcareer);
		view.updateCareerAndLevel(this.selectedcareer,4);
		if (this.getCareerframe()) {
			console.log("borrando");
			this.getCareerframe().hide();
		}
        view.show();
	},
    onLaunch: function() {
        //var careersStore = this.getCareersStore();
        //console.log(careersStore);
        //careersStore.load();
    },
	search: function(values, form) {
		console.log(values);
        var store   = this.getCareersStore(),
            filters = [],
            field;
			console.log(store.data.length);        
        //Ext.iterate(values, function(field, value) {
            filters.push(new Ext.util.Filter({
                property: 'name',
                value   : 'asd'
            }));
        //});
        
        store.clearFilter();
        store.filter(filters);
		console.log(store.data.length);
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