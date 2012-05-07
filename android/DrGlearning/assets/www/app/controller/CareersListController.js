/**
 * @class DrGlearning.controller.CareersListController
 * @extends Ext.app.Controller
 *
 * Controller to manage Careers List Menu and Logic.
 */

//Global Words to skip JSLint validation//
/*global Ext i18n google GeoJSON activityView event clearInterval setInterval DrGlearning document*/

Ext.define('DrGlearning.controller.CareersListController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            main: 'mainview',
            careersframe: 'careersframe',
            settings: 'settings'
        }
    },
    selectedcareer: null,
    selectedlevel: null,
    knowledgeFields: null,
    actionSheet: null,
    career: null,
    flechaizqHtml: "<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><img src='resources/images/flechaizq.png' alt='flecha'></div>",
    flechaderHtml: "<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><img src='resources/images/flecha.png' alt='flecha'></div>",
    /*
     * Initializate Controller.
     */
    initializate: function ()
	{
        document.body.style.background = "";
        //console.log(document.body.style.background);
        this.careerController = this.getApplication().getController('CareerController');
        this.levelController = this.getApplication().getController('LevelController');
        this.daoController = this.getApplication().getController('DaoController');
        //console.log(this);
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
			'button[id=refresh]': {
                tap: this.refresh
            },
            'selectfield[name=knnowledge_field]': {
                change: this.filterCareersByKnowledge
            },
            'button[id=settings]': {
                tap: this.getApplication().getController('UserSettingsController').settings
            
            },
			'button[id=updateAll]': {
                tap: this.updateAll
            
            },			
            'button[id=saveSettings]': {
                tap: this.getApplication().getController('UserSettingsController').saveSettings
            
            },
            'button[id=export]': {
                tap: this.getApplication().getController('UserSettingsController').exportUser
            
            },
            'button[id=import]': {
                tap: this.getApplication().getController('UserSettingsController').importUser
            
            },   
			'button[id=backFromSettings]': {
                tap: this.toCareersFromSettings
            }
        });
    },
	toCareersFromSettings: function ()
	{
        localStorage.selectedcareer = 0;
        this.getSettings().hide();
        this.index();
    },
    //getting the string name of a level giving its index
    getLevelName: function (index)
	{
        var levelStrings = ["illetratum", "primary", "secondary", "highschool", "college", "master", "phd", "postdoc", "professor", "emeritus"];
        return levelStrings[index];
    },
    /*
     * Showing Installed Careers.
     */
    index: function ()  
	{
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", true);
		store.filter("update", true);
		var numberOfUpdates = store.getCount();
		store.clearFilter();
        store.filter("installed", true);
        // Updating levels in career models
        //console.log(store.getData());
        for (var index in store.getData().items) 
		{
            //console.log(store.getAt(index).data.installed);
            if (store.getAt(index).data.installed) 
			{
                var levelstemp = [];
                levelstemp = this.getApplication().getController('DaoController').getLevels('' + store.getAt(index).data.id);
                for (var i = 0; i < levelstemp.length; i++) {
                    store.getAt(index).data[this.getLevelName(levelstemp[i] - 1)] = "exists";
                    if (this.getApplication().getController('DaoController').isApproved(store.getAt(index).data.id, Ext.getStore('Levels').getAt(levelstemp[i] - 1).data)) {
                        store.getAt(index).data[this.getLevelName(levelstemp[i] - 1)] = "successed";
                    }
                }
            }
        }
        
        // Indexing list
        
		var view1 = this.getCareersframe();

        if (view1) {
            view1.hide();
        }
        Ext.create('DrGlearning.view.CareersFrame');
        var view1 = this.getCareersframe();
        view1.down('title').setTitle(i18n.gettext('Dr. Glearning'));
        this.filterCareers();
		if (store.getCount() == 0) {
            view1.down('careerslist').hide();
        }
		if(numberOfUpdates > 0)
		{
			view1.down('toolbar[id=toolbarBottomSettings]').down('button[id=updateAll]').show();
		}else
		{
			view1.down('toolbar[id=toolbarBottomSettings]').down('button[id=updateAll]').hide();
		}
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarBottomSettings]').show();
        view1.down('toolbar[id=toolbarTopAdd]').hide();
        view1.down('toolbar[id=toolbarBottomAdd]').hide();
        view1.show();
        if (localStorage.selectedcareer != undefined && localStorage.selectedcareer != 0) 
		{
            Ext.Msg.confirm("Last career", "Return to last career?", function (answer)
			{
                if (answer == 'yes') {
                    this.getApplication().getController('CareersListController').addOrStartCareer(undefined, undefined, undefined, Ext.getStore('Careers').getById(localStorage.selectedcareer));
                }
                else {
                    localStorage.selectedcareer = 0;
                }
            }, this); 
        }
        
    },
    /*
     * Method call when tap on a Carrer Item in the list.
     */
    addOrStartCareer: function (list, itemIndex, item, career, e)
	{
        this.selectedcareer = career;
        if (career.data.installed === false) 
		{
            if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('You need data connection to install careers'), Ext.emptyFn);
            }
            else {
                Ext.Msg.confirm(i18n.gettext("Install Career?"), i18n.gettext("Are you sure you want to install this career?"), function (answer, pako)
				{
                    if (answer === 'yes') 
					{
                        Ext.Viewport.setMasked({
                            xtype: 'loadmask',
                            message: i18n.gettext('Downloading Career...'),
                            indicator: true,
                            html: "<img src='resources/images/ic_launcher.png'>"
                        });
                        this.getApplication().getController('DaoController').installCareer(career.data.id, this.installFinished, this);
                    }
                }, this);
            }
            
        }
        else {
			this.career = career;
            var that = this;
            if (e !== undefined && e.touch.target.id == "uninstall") {
                this.actionSheet = Ext.create('Ext.ActionSheet', {
                    items: [{
                        text: 'Uninstall course',
                        ui: 'decline',
                        handler: function(){
                            this.parent.hide();
                            Ext.Msg.confirm(i18n.gettext("Uninstall Career?"), i18n.gettext("If you uninstall this career, all your points will be lost.Are you sure you want to uninstall this career?"), function (answer, pako)
							{
                                if (answer === 'yes') {
                                    this.getApplication().getController('DaoController').deleteCareer(this.career.data.id, this.installFinished, this);
                                    this.index();
                                }
                            }, that);
                        }
                    }, {
                        text: 'Cancel',
                        handler: function(){
                            this.parent.hide();
                        }
                    }]
                });
                
                Ext.Viewport.add(this.actionSheet);
                this.actionSheet.show();
                
            }
            else 
                if (e != undefined && e.touch.target.id == "update") {
                    var actionSheet = Ext.create('Ext.ActionSheet', {
                        items: [{
                            text: 'Update course',
                            ui: 'confirm',
							handler: function(){
                            this.parent.hide();
                            Ext.Msg.confirm(i18n.gettext("Update Career?"), i18n.gettext("Are you sure you want to update this career?"), function(answer, pako){
                                if (answer == 'yes') {
                                     Ext.Viewport.setMasked({
					                 xtype: 'loadmask',
					                 message: i18n.gettext('Updating Career...'),
					                 indicator: true,
					                 html: "<img src='resources/images/ic_launcher.png'>"
					                 });
					                 this.getApplication().getController('DaoController').updateCareer(career.data.id, this.installFinished, this);
                                }
                            }, that);
                        }
                        }, {
                            text: 'Uninstall course',
	                        ui: 'decline',
	                        handler: function(){
	                            this.parent.hide();
	                            Ext.Msg.confirm(i18n.gettext("Uninstall Career?"), i18n.gettext("If you uninstall this career, all your points will be lost.Are you sure you want to uninstall this career?"), function(answer, pako){
	                                if (answer == 'yes') {
	                                    this.getApplication().getController('DaoController').deleteCareer(this.career.data.id, this.installFinished, this);
	                                    this.index();
	                                }
	                            }, that);
	                        }
	                    }, {
	                        text: 'Cancel',
	                        handler: function(){
	                            this.parent.hide();
	                        }
	                    }]
	                });
                    
                    Ext.Viewport.add(actionSheet);
                    actionSheet.show();
                    
                /*Ext.Msg.confirm(i18n.gettext("Update Career?"), i18n.gettext("Are you sure you want to update this career?"), function(answer, pako){
                 if (answer == 'yes') {
                 Ext.Viewport.setMasked({
                 xtype: 'loadmask',
                 message: i18n.gettext('Downloading Career...'),
                 indicator: true,
                 html: "<img src='resources/images/ic_launcher.png'>"
                 });
                 this.getApplication().getController('DaoController').updateCareer(career.data.id, this.installFinished, this);
                 }
                 }, this);*/
                }
                else {
                    this.getApplication().getController('CareerController').updateCareer(career);
                    localStorage.selectedcareer = career.data.id;
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
        store.load();
    },
    
    filterCareersByKnowledge: function(){
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", false);
        var value = Ext.ComponentQuery.query('selectfield[name=knnowledge_field]')[0].getValue();
        if (value != 'All') {
            store.filterBy(function(record, id){
                var bool = false;
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
        localStorage.selectedcareer = 0;
        var view12 = this.getCareersframe();
        view12.down('title').setTitle(i18n.gettext('Careers'));
        knowledgeFields = this.daoController.getknowledgesFields();
        view12.down('careerslist').show();
        view12.down('careerslist').refresh();
        options = [{
            text: 'All',
            value: 'All'
        }];
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
        view12.down('toolbar[id=toolbarTopNormal]').hide();
        view12.down('toolbar[id=toolbarBottomSettings]').hide();
        view12.down('toolbar[id=toolbarTopAdd]').show();
        view12.down('toolbar[id=toolbarBottomAdd]').show();
        view12.show();
        view12.down('careerslist').refresh();
        this.filterCareersByKnowledge();
    },
    /*
     * Searching for specific career by writing in searchbox.
     */
    search: function(values, form){
        form = form.toLowerCase();
        var store = Ext.getStore('Careers');
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
	updateAll: function() {
		var store = Ext.getStore('Careers');
        
        store.clearFilter();
        store.filter("installed", true);
		store.filter("update", true);
		this.updatesLeft=store.getCount();
		Ext.Viewport.setMasked({
	         xtype: 'loadmask',
	         message: i18n.gettext('Updating Courses...'),
	         indicator: true,
	         html: "<img src='resources/images/ic_launcher.png'>"
        });
		store.each(function (career) {
			this.getApplication().getController('DaoController').updateCareer(career.data.id, this.updateFinished, this);
		},this);
		store.clearFilter();
		store.filter("installed", true);
	 },
	 updateFinished: function(scope){
        this.updatesLeft--;
		if(this.updatesLeft==0){
			Ext.Viewport.setMasked(false);
			this.index();
		}
        
    },
	refresh: function(scope){
        
    }
});

