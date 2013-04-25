/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace DrGlearning
*/
try {
    (function () {
    // Exceptions Catcher Begins

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
            installing : false,
            /*
             * Initializate Controller.
             */
            initializate: function ()
            {
                document.body.style.background = "";
                Ext.create('DrGlearning.view.Main');
                Ext.create('DrGlearning.view.CareersFrame');
                this.careersStore = Ext.getStore('Careers');
                this.levelsStore = Ext.getStore('Levels');
                this.knowledgesStore = Ext.getStore('Knowledges');
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
                    /*'button[id=sync]': {
                        //tap: this.userSettingsController.sync
                    
                    },*/
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
                this.installing = false;
                // Indexing list
                
                this.getCareersframe().show();
                this.getCareersframe().down('title').setTitle(i18n.gettext('Dr. Glearning'));
                this.filterCareers();
                if (localStorage.imported)
                {
                    //this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').down('button[id=sync]').show();
                }
                else
                {
                    //this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').down('button[id=sync]').hide();
                }
                if (this.careersStore.getCount() === 0) {
                    this.getCareersframe().down('careerslist').hide();
                }
                if (numberOfUpdates > 0)
                {
                    this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').down('button[id=updateAll]').show();
                } else
                {
                    this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').down('button[id=updateAll]').hide();
                }
                this.getCareersframe().down('toolbar[id=toolbarTopNormal]').show();
                this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').show();
                this.getCareersframe().down('toolbar[id=toolbarTopAdd]').hide();
                this.getCareersframe().down('toolbar[id=toolbarBottomAdd]').hide();
                this.getCareersframe().show();
                var testCourse = this.getApplication().getController('LoadingController').getParameter('course');
                var testing = false;
                if (typeof(testCourse) !== "null" && typeof(testCourse) !== "undefined")
                {
                    testing = true;
                }
                if (parseInt(localStorage.selectedcareer, 10) !== 0 && localStorage.selectedcareer !== undefined && !testing) 
                {
                    Ext.Msg.confirm(i18n.gettext("Last course"), i18n.gettext("Return to last course"), function (answer)
                    {
                        if (answer === 'yes') {
                            this.CareersListController.addOrStartCareer(undefined, undefined, undefined, this.careersStore.getById(localStorage.selectedcareer));
                        }
                        else {
                            localStorage.selectedcareer = 0;
                        }
                    }, this); 
                }
                this.getCareersframe().down('careerslist').getScrollable().getScroller().on('scrollend', function () {});
                this.getCareersframe().down('careerslist').refresh();
                
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
						//console.log(levelstemp);
                        for (var j = 0; j < this.levelsStore.getCount(); j++)
                        {
                            this.careersStore.getAt(index).data[this.getLevelName(j - 1)] = 'caca';
                            
                        }
                        //If Exam Career, Else -> Explore Career
                        if (this.careersStore.getAt(index).data.career_type === "exam")
                        {
                            // nextLevelFound is an integer variable to save if is the first level allowed or anything else
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
                                    nextLevelFound = 1;
                                }
                                if (this.daoController.isApproved(this.careersStore.getAt(index).data.id, Ext.getStore('Levels').getAt(levelstemp[i] - 1).data)) {
                                    this.careersStore.getAt(index).data[this.getLevelName(levelstemp[i] - 1)] = "successed";
                                    this.careersStore.getAt(index).data[this.getLevelName(levelstemp[i + 1] - 1)] = "exists";
                                    nextLevelFound = 2;
                                }
                            }
                        } else
                        {
                            for (j = 0; j < levelstemp.length; j++) {
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
                if (this.getSettings())
                {
                  this.getSettings().hide();
                }
                this.index();
            },
            //getting the string name of a level giving its index
            getLevelName: function (index)
            {
                var levelStrings = ["illetratum", "primary", "secondary", "highschool", "college", "master", "phd", "postdoc", "professor", "emeritus"];
                return levelStrings[index];
            },

            getLevelsIconsHtml: function (career)
            {
                var html = '';
                var filesImgs = ["iletratum.png", "primary.png", "secondary.png", "highschool.png", "college.png", "master.png", "PhD.png", "post-doc.png", "professor.png", "emeritus.png"];
                for (var cont = 0; cont < career.data.levels.length ; cont++) {
                    html = html + "<img src='resources/images/level_icons/" + filesImgs[career.data.levels[cont] - 1] + "' height='40' >";
                }
                return html;
            },
            /*
             * Method call when tap on a Carrer Item in the list.
             */
            addOrStartCareer: function (list, itemIndex, item, career, e)
            {
                this.selectedcareer = career;
                if (career.data.installed === false) 
                {
                    if (e !== undefined && e.touch.target.id === "examInfo")
                    {
                        Ext.Msg.alert(i18n.gettext('Exam Modality'), i18n.gettext('In Exam Modality courses you should complete each level before you can play the next one.'), function () {
                        }, this);
                    }
                    else
                    {
						if (e.touch.target.id === "privateInfo")
		                {
		                    Ext.Msg.alert(i18n.gettext('Private Course'), i18n.gettext('This is a private course. You need a code in order to install it.'), function () {
		                    }, this);
		                }
		                else
		                {
		                    if (!this.globalSettingsController.hasNetwork()) {
		                        Ext.Msg.alert(i18n.gettext('Unable to install'), i18n.gettext('You need data connection to install courses'), Ext.emptyFn);
		                    }
		                    else {
		                        Ext.Msg.confirm(i18n.translate("Install the course %s?").fetch(career.data.name), career.data.description + '<p>' + this.getLevelsIconsHtml(career) + '</p><p>' + i18n.gettext("Are you sure you want to install this course?") + '</p>', function (answer, pako)
		                        {
		                            if (answer === 'yes') 
		                            {
		                                /*Ext.Viewport.setMasked({
		                                    xtype: 'loadmask',
		                                    message: i18n.gettext('Downloading course') + "…",
		                                    indicator: true,
		                                    html: "<img src='resources/images/ic_launcher.png'>"
		                                });*/
		                                this.daoController.checkIfCode(career.data.id, this.installFinished, this);
		                            }
		                        }, this);
		                    }
						}
                    }
                }
                else {
                    this.career = career;
                    var that = this;
                    if (e !== undefined && e.touch.target.id === "uninstall") {
                        this.actionSheet = Ext.create('Ext.ActionSheet', {
                            items: 
                            [                              
                                {
                                    text: i18n.gettext('Check for courses updates'),
                                    handler: function () {
                                        this.parent.hide();
                                        that.daoController.checkForCareerUpdate(that.career);
                                    }
                                },
                                {
                                    text: i18n.gettext('Uninstall course'),
                                    ui: 'decline',
                                    handler: function () 
                                    {
                                        this.parent.hide();
                                        Ext.Msg.confirm(i18n.gettext("Uninstall Course?"), i18n.gettext("Are you sure you want to uninstall this course?"), function (answer)
                                        {
                                            if (answer === 'yes') {
                                                this.daoController.deleteCareer(this.career.data.id, false);
                                                this.index();
                                            }
                                        }, that);
                                    }
                                }, 
                                {
                                    text: i18n.gettext('Cancel'),
                                    handler: function () {
                                        this.parent.hide();
                                    }
                                }
                            ]
                        });
                        
                        Ext.Viewport.add(this.actionSheet);
                        this.actionSheet.show();
                    }
                    else if (e !== undefined && e.touch.target.id === "update") 
                    {
                        var actionSheet = Ext.create('Ext.ActionSheet', {
                            items: 
                            [
                            {
                                text: i18n.gettext('Update course'),
                                ui: 'confirm',
                                handler: function () {
                                    this.parent.hide();
                                    Ext.Msg.confirm(i18n.gettext("Update course?"), i18n.gettext("Are you sure you want to update this course?"), function (answer) {
                                        if (answer === 'yes') {
                                            Ext.Viewport.setMasked({
                                                xtype: 'loadmask',
                                                message: i18n.gettext('Updating course') + "…",
                                                indicator: true,
                                                html: "<img src='resources/images/ic_launcher.png'>"
                                            });
											this.updatesLeft=1;
                                            this.getApplication().getController('DaoController').updateCareer2(career.data.id, this.updateFinished, this);
                                        }
                                    }, that);
                                }
                            }, {
                                text: i18n.gettext('Uninstall course'),
                                ui: 'decline',
                                handler: function () {
                                    this.parent.hide();
                                    Ext.Msg.confirm(i18n.gettext("Uninstall course?"), i18n.gettext("Are you sure you want to uninstall this course?"), function (answer, pako) {
                                        if (answer === 'yes') {
                                            this.daoController.deleteCareer(this.career.data.id, this.installFinished, this);
                                            this.index();
                                        }
                                    }, that);
                                }
                            }, {
                                text: i18n.gettext('Cancel'),
                                handler: function () {
                                    this.parent.hide();
                                }
                            }]
                        });
                        
                        Ext.Viewport.add(actionSheet);
                        actionSheet.show();
                    }
                    else {
                        if (e !== undefined && e.touch.target.id === "examInfo")
                        {
                            Ext.Msg.alert(i18n.gettext('Exam course!'), i18n.gettext('In Exam Modality courses you should complete each level before moving on to the following ones'), function () {}, this);
                        } else
                        {
                            console.log('entramos');
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
            installFinished: function (scope) {
                /*
                 * if(scope.id!='Careers') { scope=this; }
                 */
                Ext.Viewport.setMasked(false);
                scope.index();
            },
            /*
             * Filer Careers by started/not started atribute.
             */
            filterCareers: function () {
                this.careersStore.clearFilter();
                this.careersStore.filter("installed", true);
                var careerStateSelected = Ext.ComponentQuery.query('selectfield[name=state]')[0];
                if (careerStateSelected.getValue() === 'notYet') {
                    this.careersStore.filter("started", false);
                }
                if (careerStateSelected.getValue() === 'inProgress') {
                    this.careersStore.filter("started", true);
                }
                this.careersStore.load();
            },
            
            filterCareersByKnowledge: function () {
                var knowledgeSelectField = Ext.ComponentQuery.query('selectfield[name=knnowledge_field]')[0];
                var value = knowledgeSelectField.getValue();
                if (localStorage.form === undefined)
                {
                    localStorage.form = '';
                }
                if (localStorage.knowledgeValue !== value)
                {
                //localStorage.searchRequest = "false";
                    this.loadingController.careersRequest(localStorage.form, value);
                    this.careersStore.clearFilter();
                    /*this.careersStore.each(function (record) {
                        if (!record.data.installed) {
                            //record.erase();
                        }
                    });*/
                    this.careersStore.load();
                }
            },
            /*
             * Showing not installed carrers (menu to install new
             * career).
             */
            addCareer: function () {
              /*if(localStorage.restartNeeded == "true")
              {
                Ext.Msg.alert(i18n.gettext('You need restart'), i18n.gettext('You need restart Dr. Glearning to install new careers.'), function ()
                        {}, this);
              }
              else
              {*/
                if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                    Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('You need Internet connection to install new careers'), function ()
                        {}, this);
                } else {
                    this.careersStore.clearFilter();
                    if (this.careersStore.getCount() === 0)
                    {
                        //this.loadingController.careersRequest();
                        this.showCareersToInstall();
                    }
                    else
                    {
                        this.showCareersToInstall();
                    }
                }
              //}
            },
            /*
             * Searching for specific career by writing in searchbox.
             */
            showCareersToInstall: function ()
            {
                this.loadingController.knowledgesStore.sync();
                this.loadingController.knowledgesStore.load();
                this.installing = true;
                localStorage.selectedcareer = 0;
                this.getCareersframe().down('title').setTitle(i18n.gettext('Courses'));
                
                this.getCareersframe().down('careerslist').show();
                this.getCareersframe().down('careerslist').refresh();
                var options = [{
                    text: 'All',
                    value: 'All'
                }];
                this.knowledgesStore.each(function (record) {
                    options.push({
                        text: record.data.name,
                        value: record.data.name
                    });
                }, this);
                this.getCareersframe().down('selectfield[name=knnowledge_field]').setOptions(options);
                this.careersStore.clearFilter();
                this.getCareersframe().down('searchfield').setValue(localStorage.form);
                this.getCareersframe().down('selectfield[name=knnowledge_field]').setValue(localStorage.knowledgeValue);
                this.careersStore.filter('installed', false);
                this.getCareersframe().down('careerslist').refresh();
                this.getCareersframe().down('toolbar[id=toolbarTopNormal]').hide();
                this.getCareersframe().down('toolbar[id=toolbarBottomSettings]').hide();
                this.getCareersframe().down('toolbar[id=toolbarTopAdd]').show();
                this.getCareersframe().down('toolbar[id=toolbarBottomAdd]').show();
                this.getCareersframe().show();
                this.getCareersframe().down('careerslist').refresh();
                this.filterCareersByKnowledge();
                this.getCareersframe().down('careerslist').getScrollable().getScroller().on('scrollend', function (scroller, x, y) {
                    var distanceToEnd = scroller.maxPosition.y - scroller.position.y;
                    if (distanceToEnd < 300) {
                        this.loadingController.careersRequest(localStorage.form, localStorage.knowledgeValue);
                    }
                }, this, {buffer: 300});
            },
            search: function (values, form) {
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
                this.loadingController.careersRequest(localStorage.form, localStorage.knowledgeValue);
                this.careersStore.clearFilter();
                //this.careersStore.filter(filters);
                /*this.careersStore.each(function (record) {
                    if (!record.data.installed) {
                        //record.erase();
                    }
                });*/
                this.careersStore.load();
                //this.getCareersframe().down('careerslist').refresh();
            },
            getData: function (newActivity) {
                var html = "";
                for (var cont = 0; cont < newActivity.data.length; cont++) {
                    html = html + " " + cont + ":" + newActivity.data[cont] + "</br>";
                }
                return html;
            },
            updateAll: function () {
                this.careersStore.clearFilter();
                this.careersStore.filter("installed", true);
                this.careersStore.filter("update", true);
                this.updatesLeft = this.careersStore.getCount();
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Updating courses') + "…",
                    indicator: true,
                    html: "<img src='resources/images/ic_launcher.png'>"
                });
                this.careersStore.clearFilter();
                this.careersStore.filter("installed", true);
				for (var index in this.careersStore.getData().items) 
                {
                    if (this.careersStore.getAt(index).data.installed && this.careersStore.getAt(index).data.update) 
                    {
						this.getApplication().getController('DaoController').updateCareer(this.careersStore.getAt(index).data.id, this.updateFinished, this);
					}
				}
            },
            updateFinished: function (scope) {
                scope.updatesLeft--;
                if (scope.updatesLeft < 1) {
                    Ext.Viewport.setMasked(false);
                    scope.index();
					scope.updateLevelsState();
                }
            },
            refresh: function (scope) {
                this.loadingController.careersRequest();
            },
            refreshingAfterImport: function()
            {
                this.getCareersframe().down('careerslist').show();
                this.getCareersframe().down('careerslist').refresh();
                this.careersStore.clearFilter();
                this.careersStore.filter('installed', false);
                this.getCareersframe().down('careerslist').refresh();
                this.getCareersframe().show();
                this.getCareersframe().down('careerslist').refresh();
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
