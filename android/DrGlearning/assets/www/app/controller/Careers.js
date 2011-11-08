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
            },
            'selectfield[name=state]': {
                change: this.filterCareers
            }
        });
        
        this.index();
    },
    index: function(){
    		
        var view = this.getCareerframe();
        if (view) {
            view.hide();
        }
        
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter("installed", "true");
        
        console.log(store);
        var view1 = this.getCareersframe();
        if (view1) {
            view1.hide();
        }
        this.getCareersFrameView().create();
        var view1 = this.getCareersframe();
        
        view1.down('careerslist').refresh();
        this.filterCareers();
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarTopAdd]').hide();
        view1.down('toolbar[id=toolbarBottomAdd]').hide();
        view1.show();
    },
    filterCareers: function(){
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter("installed", "true");
        var view1 = this.getCareersframe();
        if (view1.down('selectfield[name=state]').getValue() == 'notYet') {
            store.filter("started", "false");
        }
        if (view1.down('selectfield[name=state]').getValue() == 'inProgress') {
            store.filter("started", "true");
        }
        store.load();
        view1.down('careerslist').refresh();
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
		this.selectedcareer=career;
		if (career.data.installed == "false") 
		{

			Ext.Msg.confirm("Install Career?","Are you sure you want to install this career?",function(answer){
																								if (answer == 'yes') {
																									this.getController('DaoController').installCareer(career.data.id, this.addCareer,this);
																								}
																									},this);

		}
		else 
		{
			this.getCareerFrameView().create();
			var view = this.getCareerframe();
			view.updateCareer(career);
			this.getCareersframe().hide();
			view.show();
		}
    },
	installFinished: function(){
		
		var view1 = getCareersframe();
        view1.down('careerslist').refresh();
		console.log("terminao");
	},
    
    addCareer: function(scope){
		console.log(scope);
		if(scope.id!='Careers')
		{
			console.log('es el boton:'+scope);
			scope=this;
		}
		console.log(scope);
        var store = scope.getCareersStore();
        store.clearFilter();
        store.filter('installed', 'false');
        var caca = scope.getCareersFrameView().create();
        caca.destroy();
        var view12 = scope.getCareersframe();
        var view = scope.getCareerframe();
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
     
    },
    search: function(values, form){
        form = form.toLowerCase();
        var store = this.getCareersStore();
        var filters = [];
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.installed == 'false';
            }
        }));
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.name.toLowerCase().indexOf(form) != -1 || item.data.description.toLowerCase().indexOf(form) != -1;
            }
        }));
        store.clearFilter();
        store.filter(filters);
        store.load();
        var view12 = this.getCareersframe();
        view12.down('careerslist').refresh();
        console.log(view12.down('careerslist'));
    }
    
});
