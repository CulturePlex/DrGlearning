/**
 * @class DrGlearning.controller.CareersListController
 * @extends Ext.app.Controller
 *
 * Controller to manage Careers List Menu and Logic.
 */
Ext.define('DrGlearning.controller.CareersListController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            mainView: 'mainview',
            careersframe: 'careersframe',
            settings: 'settings',
        }
    },
    selectedcareer: null,
    selectedlevel: null,
    knowledgeFields: null,
    flechaizqHtml: "<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><img src='resources/images/flechaizq.png' alt='flecha'></div>",
    flechaderHtml: "<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><img src='resources/images/flecha.png' alt='flecha'></div>",
    /*
     * Initializate Controller.
     */
    initializate: function(){
        document.body.style.background = "";
        console.log(document.body.style.background);
        this.careerController = this.getApplication().getController('CareerController');
        this.levelController = this.getApplication().getController('LevelController');
        this.daoController = this.getApplication().getController('DaoController');
        console.log(this);
        Ext.create('DrGlearning.view.Main');
        this.control({
            'careerslist': {
                itemtap: this.addOrStartCareer
            },
            'button[id=addCareer]': {
                tap: this.addCareer
            },
            'button[customId=addCareer]': {
                tap: this.addCareer
            },
            'searchfield[id=searchbox]': {
                change: this.search
            },
            'selectfield[name=state]': {
                change: this.filterCareers
            },
            'button[id=back]': {
                tap: this.index
            },
            
            'selectfield[name=knnowledge_field]': {
                change: this.filterCareersByKnowledge
            },
            
            'button[id=settings]': {
                tap: this.getApplication().getController('UserSettingsController').settings
            
            },
            'button[id=save]': {
                tap: this.getApplication().getController('UserSettingsController').saveSettings
            
            },
            'button[id=export]': {
                tap: this.getApplication().getController('UserSettingsController').exportUser
            
            },
            'button[id=import]': {
                tap: this.getApplication().getController('UserSettingsController').importUser
            
            }
        });
        this.index();
    },
    /*
     * Showing Installed Careers.
     */
    index: function(){
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", true);
        var view1 = this.getCareersframe();
        if (view1) {
            view1.hide();
        }
        Ext.create('DrGlearning.view.CareersFrame');
        var view1 = this.getCareersframe();
        this.filterCareers();
        if (store.getCount() == 0) {
            view1.down('careerslist').hide();
        }
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarBottomSettings]').show();
        view1.down('toolbar[id=toolbarTopAdd]').hide();
        view1.down('toolbar[id=toolbarBottomAdd]').hide();
        view1.show();
    },
    /*
     * Method call when tap on a Carrer Item in the list.
     */
    addOrStartCareer: function(list, itemIndex, item, career,e){
		//console.log(career.data.installed);
        this.selectedcareer = career;
        console.log(this.selectedcareer);
        if (career.data.installed == false) {
            Ext.Msg.confirm("Install Career?", "Are you sure you want to install this career?", function(answer, pako){
                if (answer == 'yes') {
                    this.getApplication().getController('DaoController').installCareer(career.data.id, this.installFinished, this);
                }
            }, this);
        }
        else {
			if(e.touch.target.id=="uninstall")
			{
				Ext.Msg.confirm("Uninstall Career?", "If you uninstall this career, all your points will be lost.Are you sure you want to uninstall this career?", function(answer, pako){
                if (answer == 'yes') {
                    this.getApplication().getController('DaoController').deleteCareer(career.data.id, this.installFinished, this);
					this.index();
                }
            }, this);
			}else if(e.touch.target.id=="update")
			{	
				Ext.Msg.confirm("Update Career?", "Are you sure you want to update this career?", function(answer, pako){
				if (answer == 'yes') {
                    this.getApplication().getController('DaoController').updateCareer(career.data.id, this.installFinished, this);
					this.index();
                }
			}, this);
			}else
			{
				this.getApplication().getController('CareerController').updateCareer(career);
	            this.getCareersframe().hide();				
			}
            
        }
    },
    /*
     * Callback function for Career install finished.
     */
    installFinished: function(scope){
        /*
         * if(scope.id!='Careers') { scope=this; }
         */
        scope.index();
    },
    /*
     * Filer Careers by started/not started atribute.
     */
    filterCareers: function(){
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", true);
        var view1 = this.getCareersframe();
        var careerStateSelected = Ext.ComponentQuery.query('selectfield[name=state]')[0];
        if (careerStateSelected.getValue() == 'notYet') {
            store.filter("started", false);
        }
        if (careerStateSelected.getValue() == 'inProgress') {
            store.filter("started", true);
        }
		console.log(store);
        store.load();
    },
    
    filterCareersByKnowledge: function(){
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", false);
		var value=Ext.ComponentQuery.query('selectfield[name=knnowledge_field]')[0].getValue();
		if(value!='All')
		{
            store.filterBy(
				function(record,id)
				{
					var bool=false;
					for (i = 0; i < record.data.knowledges.length; i++) {
						bool = bool || record.data.knowledges[i].name == Ext.ComponentQuery.query('selectfield[name=knnowledge_field]')[0].getValue();
					}
					return bool;
					});
        }
        store.load();
    },
    /*
     * Showing not installed carrers (menu to install new
     * career).
     */
    addCareer: function(){
    	
        knowledgeFields = this.daoController.getknowledgesFields();
        console.log(knowledgeFields);
        var view12 = this.getCareersframe();
        
        view12.down('careerslist').show();
        view12.down('careerslist').refresh();
        options = [{text:'All',value:'All'}];
        for (var i = 0; i < knowledgeFields.length; i++) {
            options.push({
                text: knowledgeFields[i],
                value: knowledgeFields[i]
            });
        }
        view12.down('selectfield[name=knnowledge_field]').setOptions(options);
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter('installed', false);
        
        var view12 = this.getCareersframe();
        view12.down('careerslist').refresh();
        if (store.getCount() == 0) {
            // console.log(view12.down('careerslist'));
            // view12.down('careerslist').setMasked(true);
        }
        view12.down('toolbar[id=toolbarTopNormal]').hide();
        view12.down('toolbar[id=toolbarBottomSettings]').hide();
        view12.down('toolbar[id=toolbarTopAdd]').show();
        view12.down('toolbar[id=toolbarBottomAdd]').show();
        view12.show();
		console.log(view12.down('careerslist'));
        view12.down('careerslist').refresh();
        console.log(view12.down('careerslist').getStore().getCount());
		this.filterCareersByKnowledge();
    },
    /*
     * Searching for specific career by writing in searchbox.
     */
    search: function(values, form){
        form = form.toLowerCase();
        var store = Ext.getStore('Carrers');
        var filters = [];
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.installed == false;
            }
        }));
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.name.toLowerCase().indexOf(form) !=
                -1 ||
                item.data.description.toLowerCase().indexOf(form) !=
                -1;
            }
        }));
        store.clearFilter();
        store.filter(filters);
        store.load();
        var view12 = this.getCareersframe();
        view12.down('careerslist').refresh();
    },
    getData: function(newActivity){
        var html = "";
        for (cont in newActivity.data) {
            html = html + " " + cont + ":" +
            newActivity.data[cont] +
            "</br>"
        }
        return html;
    },
});

