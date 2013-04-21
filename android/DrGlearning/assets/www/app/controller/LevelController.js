/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/

/*global
    Ext Jed catalogueEN catalogueES catalogueFR i18n google GeoJSON StackTrace MathJax Connection
*/
/**
 * @class DrGlearning.controller.Activities
 * @extends Ext.app.Controller
 *
 * Controller to manage Level Menu and Logic.
 */

try {
    (function () {
    // Exceptions Catcher Begins

        Ext.define('DrGlearning.controller.LevelController', {
            extend: 'Ext.app.Controller',
            config: {
                refs: {
                    levelframe: 'levelframe',
                    activityframe: 'activityframe'
                }
            },
            currentActivity: null,
            learnlevelHtml: null,
            learnlevelWidth: null,
            learnlevelHeight: null,
            infolevelHtml: null,
            /*
             * Initializate Controller.
             */
            launch: function () {
                this.careersListController = this.getApplication().getController('CareersListController');
                this.careerController = this.getApplication().getController('CareerController');
                this.levelController = this.getApplication().getController('LevelController');
                this.daoController = this.getApplication().getController('DaoController');
                this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
                
                this.quizController = this.getApplication().getController('activities.QuizController');
                this.visualController = this.getApplication().getController('activities.VisualController');
                this.relationalController = this.getApplication().getController('activities.RelationalController');
                this.geospatialController = this.getApplication().getController('activities.GeospatialController');
                this.linguisticController = this.getApplication().getController('activities.LinguisticController');
                this.temporalController = this.getApplication().getController('activities.TemporalController');
                
                this.activitiesStore = Ext.getStore('Activities');
                this.levelsStore = Ext.getStore('Levels');
                
                Ext.create('DrGlearning.view.ActivityFrame');
                Ext.create('DrGlearning.view.LevelFrame');
                
                this.detail = this.getLevelframe().down('leveldetail');
                this.activitieslist = this.getLevelframe().down('list[customId=activitiesList]');
                this.levelTitle = this.getLevelframe().down('title[id=title]');
                this.activityTitle = this.getActivityframe().down('title[customId=title]');
                this.control({
                    'button[id=help]': {
                        tap: this.helpAndQuery
                    },
                    '[customId=query_label]': {
                        click: this.helpAndQuery
                    },
                    'button[id=backtolevels]': {
                        tap: this.tolevels
                    },
                    'button[id=startActivity]': {
                        tap: this.startActivity
                    },
                    'button[customId=backtolevel]': {
                        tap: this.tolevel
                    },
                    '[customId=centro]': {
                        tap: this.startActivity
                    },
                    'list[customId=activitiesList]': {
                        itemtap: this.startActivity
                    },
                    'button[customId=learnlevel]': {
                        tap: this.toLearnLevel
                    },
                    'button[customId=infolevel]': {
                        tap: this.toInfoLevel
                    }
                });
            },
            //Showing learn content
            toLearnLevel: function ()
            {
                var learn =  Ext.create('DrGlearning.view.Learn');
                this.globalSettingsController.learnParent = this.getLevelframe();
                learn.setWidth(this.learnlevelWidth);
                learn.setHeight(this.learnlevelHeight + 55);
                learn.setHtml(this.learnlevelHtml);
                Ext.Viewport.add(learn);
                learn.show();
                this.getLevelframe().hide();
            },
            //Showing info content
            toInfoLevel: function ()
            {
                var learn =  Ext.create('DrGlearning.view.Info');
                learn.setHtml(this.infolevelHtml);
                Ext.Viewport.add(learn);
                learn.show();
            },
            /*
             * Showing levels view.
             */
            tolevels: function () {
                this.getLevelframe().hide();
                this.careerController.tocareer();
            },
             /*
             * Updating and Showing Level view.
             */
            updateLevel: function (newCareer, newLevel) {
                var level = this.levelsStore.getAt(newLevel - 1);
                if (newCareer.data[level.data.name.toLowerCase()] === "exists" || newCareer.data[level.data.name.toLowerCase()] === "successed" || newCareer.data.career_type === "explore")
                {
                    this.careerController.careerFrame.hide();
                    Ext.Viewport.setMasked({
                        xtype: 'loadmask',
                        message: i18n.gettext('Loading level') + "…",
                        indicator: true
                        //html: "<img src='resources/images/activity_icons/visual.png'>",
                    });

                    this.selectedlevel = newLevel;
                    this.getLevelframe().setListeners({
                            painted: function () {
                                Ext.Viewport.setMasked(false);
                            }
                        });
                    var filesImgs = ["iletratumB.png", "primaryB.png", "secondaryB.png", "highschoolB.png", "collegeB.png", "masterB.png", "PhDB.png", "post-docB.png", "professorB.png", "emeritusB.png"];
                    this.activitieslist.setStyle({
                        backgroundImage: 'url(resources/images/level_icons/' + filesImgs[newLevel - 1] + ')',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundFilter: 'alpha(opacity=60)'
                    });
                    this.activitieslist.refresh();
                    this.activitiesStore.sort('level_order');
                    this.activitiesStore.clearFilter();
                    this.activitiesStore.filter({filterFn: function (item) { return parseInt(item.data.careerId, 10) === parseInt(newCareer.data.id, 10); }});
                    this.activitiesStore.filter({filterFn: function (item) { return item.data.level_type === newLevel }});
                    this.levelTitle.setTitle(newCareer.data.name);
                    this.getLevelframe().show();
                    if (typeof(MathJax) !== "undefined") {
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
                    }
                    //Showing Learn Button if is necessary
                    var levelString = "level" + newLevel;
                    if (typeof(newCareer.data[levelString]) === "undefined" || newCareer.data[levelString] === null) {
                        this.getLevelframe().down('button[customId=learnlevel]').hide();
                    } else {
                        this.learnlevelHtml = newCareer.data[levelString].html;
                        this.learnlevelWidth = newCareer.data[levelString].width;
                        this.learnlevelHeight = newCareer.data[levelString].height;
                        this.getLevelframe().down('button[customId=learnlevel]').show();
                    }
                    //Showing Info Button if is necessary
                    levelString = "level" + newLevel + '_description';
                    if (newCareer.data[levelString] === null || typeof(newCareer.data[levelString]) === "undefined")
                    {
                        this.getLevelframe().down('button[customId=infolevel]').hide();
                    }
                    else
                    {
                        this.infolevelHtml = newCareer.data[levelString];
                        this.getLevelframe().down('button[customId=infolevel]').show();
                    }
                }
                else
                {
                    Ext.Msg.alert(i18n.gettext('Level locked'), i18n.gettext("You can't play this level until you have completed every previous one"), function () {
                    }, this);
                }
            },
            /*
             * Starting activity.
             */
            startActivity: function (list, itemIndex, item, activity, e) {
                this.updateActivity(activity);
                if (this.getLevelframe()) {
                    this.getLevelframe().hide();
                }
            
            },
             /*
             * Updating activity view.
             */
            updateActivity: function (newActivity) {
                this.currentActivity = newActivity;
                this.activityTitle.setTitle(newActivity.data.name);
                if (newActivity.data.activity_type === 'geospatial') {
                    if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                        Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('You need Internet connection to start this activity'), function ()
                        {
                            this.tolevel();
                        }, this);
                    } else
                    {
                        this.geospatialController.updateActivity(this.getActivityframe(), newActivity);
                    }
                }
                else if (newActivity.data.activity_type === 'visual') 
                {
                    if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                        Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('You need Internet connection to start this activity'), function ()
                        {
                            this.tolevel();
                        }, this);
                    } else
                    {
                        this.visualController.updateActivity(this.getActivityframe(), newActivity);
                    }
                } else if (newActivity.data.activity_type === 'relational') {
                    this.relationalController.updateActivity(this.getActivityframe(), newActivity);
                }
                else 
                if (newActivity.data.activity_type === 'temporal') {
                    if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                        Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('You need Internet connection to start this activity'), function ()
                        {
                            this.tolevel();
                        }, this);
                    } else
                    {
                        this.temporalController.updateActivity(this.getActivityframe(), newActivity);
                    }
                }
                else 
                if (newActivity.data.activity_type === 'linguistic') {
                    if (!this.getApplication().getController('GlobalSettingsController').hasNetwork()) {
                        Ext.Msg.alert(i18n.gettext('No Internet'), i18n.gettext('You need Internet connection to start this activity'), function ()
                        {
                            this.tolevel();
                        }, this);
                    } else
                    {
                        this.linguisticController.updateActivity(this.getActivityframe(), newActivity);
                    }
                }   
                else 
                if (newActivity.data.activity_type === 'quiz') {
                    this.quizController.updateActivity(this.getActivityframe(), newActivity);
                }
                this.getActivityframe().show();
            },
             /*
             * Updating and Showing next activity when you success one.
             */
            nextActivity: function (prevLevel) {
                var currentLevel = this.daoController.getCurrenLevel(this.careersListController.selectedcareer.data.id);
                var prevLevelString = this.levelsStore.getAt(prevLevel - 1).data.name;
                var currentLevelString;
                if (currentLevel !== -1) {
                    currentLevelString = this.levelsStore.getAt(currentLevel - 1).data.name;
                } else
                {
                    currentLevelString = 'Error';
                }
                var currentActivity = this.daoController.getCurrenActivity(this.careersListController.selectedcareer.data.id, parseInt(prevLevel, 10));
                if (currentActivity.data.successful === false) {
                    this.updateActivity(currentActivity);
                }
                else {
                    if (parseInt(currentLevel, 10) === parseInt(prevLevel, 10)) {
                        if (this.getLevelframe()) {
                            this.getLevelframe().hide();
                        }
                        this.careersListController.index();
                        this.getActivityframe().hide();
                        //this.shareScores(i18n.translate("You have completed the %s level! It was the last level, you have finished this course!").fetch(prevLevelString));
                        Ext.Msg.alert(i18n.gettext('Congrats!'), i18n.translate("You have completed the %s level! It was the last level, you have finished this course!").fetch(prevLevelString), function () {}, this);
                    }
                    else {
                        this.careerController.updateCareer(this.careersListController.selectedcareer);
                        this.getLevelframe().hide();
                        this.getActivityframe().hide();
                        if (currentLevel !== -1) {
                            this.careersListController.updateLevelsState();
                            this.careerController.updateCareer(this.careerController.selectedCareer);
                            //this.shareScores(i18n.translate("You have completed the %s level! The next one is %s").fetch(prevLevelString, currentLevelString));
                            Ext.Msg.alert(i18n.gettext('Congrats!'), i18n.translate("You have completed the %s level! The next one is %s").fetch(prevLevelString, currentLevelString), function () {}, this);
                        }
                        else {
                            //this.shareScores(i18n.translate("You have completed the %s level! It was the last level, you have finished this course!").fetch(prevLevelString));
                            Ext.Msg.alert(i18n.gettext('Congrats!'), i18n.translate("You have completed the %s level! It was the last level, you have finished this course!").fetch(prevLevelString), function () {}, this);
                        }
                    }
                }
            
            },
            /*
             * Showing Panel to share scores
             *
             */
            
            shareScores: function (text) {
                        var scores =  Ext.create('Ext.Panel', {
                            xtype: 'panel',
                            // Make it modal so you can click the mask to hide the overlay
                            modal: true,
                            hideOnMaskTap: true,
                            
                            showAnimation: {
                                type: 'popIn',
                                duration: 250,
                                easing: 'ease-out'
                            },
                            hideAnimation: {
                                type: 'popOut',
                                duration: 250,
                                easing: 'ease-out'
                            },
                            centered: true,
                            html: '<p>' + text + '</p>' + '<p> You got 78 points! </p><a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.drglearning.com" data-text="Hey i got points in Dr. Glearning!" data-via="drglearning" data-size="large" data-count="none">Tweet it!</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script><p><a>Share it in Facebook!</a></p>',//+
                            //'<iframe src="http://www.facebook.com/plugins/like.php?href=YOUR_URL" scrolling="no" frameborder="0" style="border:none; width:450px; height:80px"></iframe>'
                            // Make it hidden by default
                            hidden: true,

                            // Set the width and height of the panel
                            width: 260,
                            height: 220,

                            // Here we specify the #id of the element we created in `index.html`
                            contentEl: 'content',

                            // Style the content and make it scrollable
                            styleHtmlContent: true,
                            scrollable: true,
                            styleHtmlCls : 'popup'
                            // Insert a title docked at the top with a title
                        });
                        Ext.Viewport.add(scores);
                        scores.show();
                    },
            
            /*
             * Back to level view.
             */
            tolevel: function () {
                Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: i18n.gettext('Loading level') + "…",
                    indicator: true
                    //html: "<img src='resources/images/activity_icons/visual.png'>",
                }); 
                if (this.getActivityframe()) {
                    this.getActivityframe().hide();
                }
                this.visualController.stop();
                this.updateLevel(this.careersListController.selectedcareer, this.levelController.selectedlevel);
                this.getLevelframe().show();
            },
            /*
             * Showing help in an activity.
             */
            help: function () {
                var text = "help!";
                if (this.currentActivity.data.activity_type === 'linguistic') {
                    text = i18n.gettext("Guess the hidden message. Unlock letters to get a hint; the image might help too!");
                    Ext.Msg.alert(i18n.gettext('Help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'geospatial') {
                    text = i18n.gettext("Find the correct location on the map");
                    Ext.Msg.alert(i18n.gettext('Help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'quiz') {
                    text = i18n.gettext("Choose the right option");
                    Ext.Msg.alert(i18n.gettext('Help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'relational') {
                    text = i18n.gettext("Go from one item to another until you fulfill all the conditions");
                    Ext.Msg.alert(i18n.gettext('Help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'temporal') {
                    text = i18n.gettext("According to the question, say what was before and what was after");
                    Ext.Msg.alert(i18n.gettext('Help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'visual') {
                    text = i18n.gettext("Look at the image and answer the question. The faster you answer, the better your score!");
                    this.visualController.stopNotClear();
                    Ext.Msg.alert(i18n.gettext('Help'), text, function () {
                        this.visualController.restart();
                    }, this);
                }
            },
            /*
             * Showing the complete query of an activity.
             */
            more: function (that) {
                var text = that.currentActivity.data.query;
                Ext.Msg.alert(i18n.gettext('Question'), text, function () {
                }, that);
                
            },
            helpAndQuery: function () {
                var text = this.currentActivity.data.query;
                if (this.currentActivity.data.activity_type === 'linguistic') {
                    text += " <br>  <br>";
                    text += i18n.gettext("Guess the hidden message. Unlock letters to get a hint; the image might help too!");
                    Ext.Msg.alert(i18n.gettext('Question and help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'geospatial') {
                    text += " <br>  <br>";
                    text += i18n.gettext("Find the correct location on the map");
                    Ext.Msg.alert(i18n.gettext('Question and help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'quiz') {
                    text += " <br>  <br>";
                    text += i18n.gettext("Choose the right option");
                    Ext.Msg.alert(i18n.gettext('Question and help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'relational') {
                    text += " <br>  <br>";
                    text += i18n.gettext("Go from one item to another until you fulfill all the conditions");
                    Ext.Msg.alert(i18n.gettext('Question and help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'temporal') {
                    text += " <br>  <br>";
                    text += i18n.gettext("According to the question, say what was before and what was after");
                    Ext.Msg.alert(i18n.gettext('Question and help'), text, function () {
                    }, this);
                }
                if (this.currentActivity.data.activity_type === 'visual') {
                    text += " <br>  <br>";
                    text += i18n.gettext("Look at the image and answer the question. The faster you answer, the better your score!");
                    this.visualController.stopNotClear();
                    Ext.Msg.alert(i18n.gettext('Question and help'), text, function () {
                        this.visualController.restart();
                    }, this);
                }
                
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
