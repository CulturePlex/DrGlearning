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
    
    views: ['Main', 'CareerFrame', 'CareersFrame', 'LevelFrame', 'CareersList'],
    
    stores: ['Careers'],
    selectedcareer: null,
    
    refs: [{
        ref: 'main',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }, {
        ref: 'careerframe',
        selector: 'careerframe',
        xtype: 'careerframe'
    }, {
        ref: 'levelframe',
        selector: 'levelframe',
        xtype: 'levelframe'
    }, {
        ref: 'careersframe',
        selector: 'careersframe',
        xtype: 'careersframe'
    }],
    selectedcareer: null,
    initializate: function(){
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
            'button[id=backToAdd]': {
                tap: this.addCareer
            },
            'button[id=startLevel]': {
                tap: this.startLevel
            },
            'searchfield[id=searchbox]': {
                change: this.search
            }
        });
        
        this.index();
    },
    index: function(){
        /**var temp = this.getCareersframe();
        if (temp) {
			console.log(this.getCareersframe());
            temp.destroy();
			console.log(this.getCareersframe());
        }*/
       
        var view = this.getCareerframe();
        if (view) {
            view.hide();
        }
       
		var store = this.getCareersStore();
        store.clearFilter();
        store.filter("name", "Javascript");
		store.load();
		var store2=null;
		console.log(store);
		var view1 = this.getCareersframe();
		if (view1) {
			view1.hide();
		}
		this.getCareersFrameView().create();
		var view1 = this.getCareersframe();
		view1.down('careerslist').refresh();
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarTopAdd]').hide();
        view1.down('toolbar[id=toolbarBottomAdd]').hide();
		view1.show();
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
    
    onListTap: function(list, career){
        console.log("holas");
        this.selectedcareer = career;
        this.getCareerFrameView().create();
        var view = this.getCareerframe();
        view.updateCareer(career);
        this.getCareersframe().hide();
        view.show();
    },
    
    addCareer: function(){
		/**var temp = this.getCareersframe();
        if (temp) {
            console.log(this.getCareersframe());
            temp.destroy();
			console.log(this.getCareersframe());
        }*/
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter('name', 'Sencha Tocuh 2');
		store.load();
        var caca = this.getCareersFrameView().create();
		caca.destroy();
		var view12 = this.getCareersframe();
		console.log(view12);
        var view = this.getCareerframe();
        if (view) {
            view.hide();
        }
		view12.down('careerslist').refresh();
        view12.down('toolbar[id=toolbarTopNormal]').hide();
        view12.down('toolbar[id=toolbarTopAdd]').show();
        view12.down('toolbar[id=toolbarBottomAdd]').show();
        view12.show();
        
    },
    
    startLevel: function(){
        this.getLevelFrameView().create();
        var view = this.getLevelframe();
        view.updateCareerAndLevel(this.selectedcareer, 4);
        if (this.getCareerframe()) {
            console.log("borrando");
            this.getCareerframe().hide();
        }
        view.show();
    },
    onLaunch: function(){
        //var careersStore = this.getCareersStore();
        //console.log(careersStore);
        //careersStore.load();
    },
    search: function(values, form){
    
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter('name', form);
        var view12 = this.getCareersframe();
        view12.down('careerslist').refresh();
    }
    
});
