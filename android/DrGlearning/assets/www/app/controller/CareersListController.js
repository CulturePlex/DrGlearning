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
    //Global variable to keep search string
    form: null,
    /*
     * Initializate Controller.
     */
    initializate: function ()
    {
        document.body.style.background = "";
        Ext.create('DrGlearning.view.Main');
        Ext.create('DrGlearning.view.CareersFrame');
        this.careersStore = Ext.getStore('Careers');
        this.daoController = this.getApplication().getController('DaoController');
    },

    /*
     * Launching Controller.
     */
    launch: function ()
    {

        this.careerController = this.getApplication().getController('CareerController');
        this.levelController = this.getApplication().getController('LevelController');

        this.userSettingsController = this.getApplication().getController('UserSettingsController');
        this.CareersListController = this.getApplication().getController('CareersListController');
        this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
        this.loadingController = this.getApplication().getController('LoadingController');




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
            /*'selectfield[name=state]': {
                change: this.filterCareers
            },*/
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
                tap: this.userSettingsController.settings
            
            },
            'button[id=updateAll]': {
                tap: this.updateAll
            
            },
            'button[id=saveSettings]': {
                tap: this.userSettingsController.saveSettings
            
            },
            'button[id=export]': {
                tap: this.userSettingsController.exportUser
            
            },
            'button[id=import]': {
                tap: this.userSettingsController.importUser
            
            },
            'button[id=backFromSettings]': {
                tap: this.toCareersFromSettings
            }
        });

    },
    /*
     * Showing Installed Careers.
     */

    index: function ()  
    {
        this.careersStore.clearFilter();
        this.careersStore.filter("installed", true);
		this.careersStore.filter("update", true);
        var numberOfUpdates = this.careersStore.getCount();
        this.careersStore.clearFilter();
        this.careersStore.filter("installed", true);
        this.updateLevelsState();
        
        // Indexing list
        
        this.getCareersframe().show();
        this.getCareersframe().down('title').setTitle(i18n.gettext('Dr. Glearning'));
        this.filterCareers();
        if (this.careersStore.getCount() === 0) {
            this.getCareersframe().down('careerslist').hide();
        }
        if(numberOfUpdates > 0)
        {
            this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').down('button[id=updateAll]').show();
        }else
        {
            this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').down('button[id=updateAll]').hide();
        }
        this.getCareersframe().down('toolbar[id=toolbarTopNormal]').show();
        this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').show();
        this.getCareersframe().down('toolbar[id=toolbarTopAdd]').hide();
        this.getCareersframe().down('toolbar[id=toolbarBottomAdd]').hide();
        this.getCareersframe().show();
        if (parseInt(localStorage.selectedcareer,10) !== 0 && localStorage.selectedcareer!==undefined) 
        {
            Ext.Msg.confirm("Last career", "Return to last career?", function (answer)
            {
                if (answer == 'yes') {
                    this.CareersListController.addOrStartCareer(undefined, undefined, undefined, this.careersStore.getById(localStorage.selectedcareer));
                }
                else {
                    localStorage.selectedcareer = 0;
                }
            }, this); 
        }
        this.getCareersframe().down('careerslist').getScrollable().getScroller().on('scroll', function() {});
        
    },
    
    // Updating levels in career models
    updateLevelsState: function ()
    {
        for (var index in this.careersStore.getData().items) 
        {
            if (this.careersStore.getAt(index).data.installed) 
            {
                var levelstemp = [];
                levelstemp = this.daoController.getLevels('' + this.careersStore.getAt(index).data.id);
                //If Exam Career, Else -> Explore Career
                if (this.careersStore.getAt(index).data.career_type === "exam")
                {
                    // nestLevelFound is an integer variable to save if is the first level allowed or anything else
                    var nextLevelFound = 0;
                    for (var i = 0; i < levelstemp.length; i++) {
                        nextLevelFound--;
                        if (nextLevelFound < 1)
                        {
                            this.careersStore.getAt(index).data[this.getLevelName(levelstemp[i] - 1)] = "notallowed";
                        }
                        if (i === 0 && !this.daoController.isApproved(this.careersStore.getAt(index).data.id, Ext.getStore('Levels').getAt(levelstemp[i] - 1).data))
                        {
                        this.careersStore.getAt(index).data[this.getLevelName(levelstemp[i] - 1)] = "exists";
                        console.log('hola');
                        nextLevelFound = 1;
                        }
                        if (this.daoController.isApproved(this.careersStore.getAt(index).data.id, Ext.getStore('Levels').getAt(levelstemp[i] - 1).data)) {
                            this.careersStore.getAt(index).data[this.getLevelName(levelstemp[i] - 1)] = "successed";
                            console.log(this.getLevelName(levelstemp[i] - 1));
                            console.log(this.getLevelName(levelstemp[i+1] -1));
                            this.careersStore.getAt(index).data[this.getLevelName(levelstemp[i+1] - 1)] = "exists";
                            nextLevelFound = 2;
                        }
                    }
                }else
                {
                    for (var j = 0; j < levelstemp.length; j++) {
                    console.log(this.getLevelName(levelstemp[j] - 1));
                        this.careersStore.getAt(index).data[this.getLevelName(levelstemp[j] - 1)] = "exists";
                        if (this.daoController.isApproved(this.careersStore.getAt(index).data.id, Ext.getStore('Levels').getAt(levelstemp[j] - 1).data)) {
                            this.careersStore.getAt(index).data[this.getLevelName(levelstemp[j] - 1)] = "successed";
                        }
                    }
                }
            }
        }
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
        var levelStrings = ["illetratum", "primary", "secondary", "high school", "college", "master", "phd", "post-doc", "professor", "emeritus"];
        return levelStrings[index];
    },

    /*
     * Method call when tap on a Carrer Item in the list.
     */
    addOrStartCareer: function (list, itemIndex, item, career, e)
    {
        this.selectedcareer = career;
        if (career.data.installed === false) 
        {
            if(e !== undefined && e.touch.target.id === "examInfo")
            {
                Ext.Msg.alert(i18n.gettext('Exam Modality'), i18n.gettext('In Exam Modality Courses you should complete each level before you can play the next one.'), function(){
                }, this);
            }
            else
            {
            if (!this.globalSettingsController.hasNetwork()) {
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
                        this.daoController.installCareer(career.data.id, this.installFinished, this);
                    }
                }, this);
            }
            }
        }
        else {
            this.career = career;
            var that = this;
            if (e !== undefined && e.touch.target.id == "uninstall") {
                this.actionSheet = Ext.create('Ext.ActionSheet', {
                    items: [{
                        text: i18n.gettext('Send scores')
                        },
                        {
                        text: i18n.gettext('Check for course updates')
                        },{
                        text: 'Uninstall course',
                        ui: 'decline',
                        handler: function(){
                            this.parent.hide();
                            Ext.Msg.confirm(i18n.gettext("Uninstall Career?"), i18n.gettext("If you uninstall this career, all your points will be lost.Are you sure you want to uninstall this career?"), function (answer)
                            {
                                if (answer === 'yes') {
                                    this.daoController.deleteCareer(this.career.data.id, this.installFinished, this);
                                    this.index();
                                }
                            }, that);
                        }
                    }, {
                        text: i18n.gettext('Cancel'),
                        handler: function(){
                            this.parent.hide();
                        }
                    }]
                });
                
                Ext.Viewport.add(this.actionSheet);
                this.actionSheet.show();
                
            }
            else 
                if (e !== undefined && e.touch.target.id === "update") {
                    var actionSheet = Ext.create('Ext.ActionSheet', {
                        items: [{
                        text: i18n.gettext('Send scores')
                        },{
                            text: 'Update course',
                            ui: 'confirm',
                            handler: function(){
                            this.parent.hide();
                            Ext.Msg.confirm(i18n.gettext("Update Career?"), i18n.gettext("Are you sure you want to update this career?"), function(answer){
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
                            text: i18n.gettext('Uninstall course'),
                            ui: 'decline',
                            handler: function(){
                                this.parent.hide();
                                Ext.Msg.confirm(i18n.gettext("Uninstall Career?"), i18n.gettext("If you uninstall this career, all your points will be lost.Are you sure you want to uninstall this career?"), function(answer, pako){
                                    if (answer == 'yes') {
                                        this.daoController.deleteCareer(this.career.data.id, this.installFinished, this);
                                        this.index();
                                    }
                                }, that);
                            }
                        }, {
                            text: i18n.gettext('Cancel'),
                            handler: function(){
                                this.parent.hide();
                            }
                        }]
                    });
                    
                    Ext.Viewport.add(actionSheet);
                    actionSheet.show();
                }
                else {
                    if(e !== undefined && e.touch.target.id === "examInfo")
                    {
                        Ext.Msg.alert(i18n.gettext('Exam Modality'), i18n.gettext('In Exam Modality Courses you should complete each level before you can play the next one.'), function(){
            }, this);
                    }else
                    {
                        this.getApplication().getController('CareerController').updateCareer(career);
                        localStorage.selectedcareer = career.data.id;
                        this.getCareersframe().hide();
                    }
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
        this.careersStore.clearFilter();
        this.careersStore.filter("installed", true);
        var careerStateSelected = Ext.ComponentQuery.query('selectfield[name=state]')[0];
        if (careerStateSelected.getValue() == 'notYet') {
            this.careersStore.filter("started", false);
        }
        if (careerStateSelected.getValue() == 'inProgress') {
            this.careersStore.filter("started", true);
        }
        this.careersStore.load();
    },
    
    filterCareersByKnowledge: function(){
        this.careersStore.clearFilter();
        this.careersStore.filter("installed", false);
        var knowledgeSelectField = Ext.ComponentQuery.query('selectfield[name=knnowledge_field]')[0];
        var value = knowledgeSelectField.getValue();
        if (value != 'All') {
            this.careersStore.filterBy(function(record, id){
                var bool = false;
                for (i = 0; i < record.data.knowledges.length; i++) {
                    bool = bool || record.data.knowledges[i].name == knowledgeSelectField.getValue();
                }
                return bool;
            });
        }
        this.careersStore.load();
    },
    /*
     * Showing not installed carrers (menu to install new
     * career).
     */
    addCareer: function(){
        this.careersStore.clearFilter();
        if(this.careersStore.getCount()===0)
        {
            //this.loadingController.careersRequest();
            this.showCareersToInstall();
        }
        else
        {
            this.showCareersToInstall();
        }
    },
    /*
     * Searching for specific career by writing in searchbox.
     */
    showCareersToInstall: function()
    {
        localStorage.selectedcareer = 0;
        this.getCareersframe().down('title').setTitle(i18n.gettext('Careers'));
        knowledgeFields = this.daoController.getknowledgesFields();
        this.getCareersframe().down('careerslist').show();
        this.getCareersframe().down('careerslist').refresh();
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
        this.getCareersframe().down('selectfield[name=knnowledge_field]').setOptions(options);
        this.careersStore.clearFilter();
        this.getCareersframe().down('searchfield').setValue(localStorage.form);
        this.careersStore.filter('installed', false);
        this.getCareersframe().down('careerslist').refresh();
        this.getCareersframe().down('toolbar[id=toolbarTopNormal]').hide();
        this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').hide();
        this.getCareersframe().down('toolbar[id=toolbarTopAdd]').show();
        this.getCareersframe().down('toolbar[id=toolbarBottomAdd]').show();
        this.getCareersframe().show();
        this.getCareersframe().down('careerslist').refresh();
        this.filterCareersByKnowledge();
        this.getCareersframe().down('careerslist').getScrollable().getScroller().on('scroll', function(scroller, x , y) {
          var distanceToEnd = scroller.maxPosition.y - scroller.position.y;
          if (distanceToEnd < 300) {
               this.loadingController.careersRequest(localStorage.form);
         }
        }, this, {buffer: 300});
    },
    search: function(values, form){
        localStorage.form = form.toLowerCase();
        /*var filters = [];
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.installed === false;
            }
        }));
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.name.toLowerCase().indexOf(form) !=
                -1 ||
                item.data.description.toLowerCase().indexOf(form) !=
                -1;
            }
        }));*/
        this.loadingController.careersRequest(localStorage.form);
        this.careersStore.clearFilter();
        //this.careersStore.filter(filters);
        this.careersStore.each(function(record){
            if(record.data.installed === false){
                record.erase();
            }
        });
        this.careersStore.load();
        this.getCareersframe().down('careerslist').refresh();
    },
    getData: function(newActivity){
        var html = "";
        for (var cont in newActivity.data) {
            html = html + " " + cont + ":" + newActivity.data[cont] + "</br>";
        }
        return html;
    },
    updateAll: function() {
        this.careersStore.clearFilter();
        this.careersStore.filter("installed", true);
        this.careersStore.filter("update", true);
        this.updatesLeft=this.careersStore.getCount();
        Ext.Viewport.setMasked({
             xtype: 'loadmask',
             message: i18n.gettext('Updating Courses...'),
             indicator: true,
             html: "<img src='resources/images/ic_launcher.png'>"
        });
        this.careersStore.clearFilter();
        this.careersStore.filter("installed", true);
     },
     updateFinished: function(scope){
        this.updatesLeft--;
        if(this.updatesLeft===0){
            Ext.Viewport.setMasked(false);
            this.index();
        }
        
    },
    refresh: function(scope){
        this.loadingController.careersRequest();
    }
});

