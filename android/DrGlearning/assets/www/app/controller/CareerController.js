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

        Ext.define('DrGlearning.controller.CareerController', {
            extend: 'Ext.app.Controller',
            xtype: 'careercontroller',
            careerFrame: null,
            carousel: null,
            
            careersListController: null,
            levelController: null,
            daoController: null,
            levelsStore: null,
            selectedCareer : null,
            learnView: null,
            
            learnHtml: null,
            learnHeight: null,
            learnWidth: null,
            /*
             * Initializate Controller.
             */
            launch: function ()
            {
                this.careersListController = this.getApplication().getController('CareersListController');
                this.levelController = this.getApplication().getController('LevelController');
                this.daoController = this.getApplication().getController('DaoController');
                this.levelsStore = Ext.getStore('Levels');
                this.careerFrame = Ext.create('DrGlearning.view.CareerFrame');
                this.globalSettingsController = this.getApplication().getController('GlobalSettingsController');
                this.control({
                    'button[customId=startLevel]': {
                        tap: this.startLevel
                    },
                    'button[id=backToCareers]': {
                        tap: this.toCareers
                    },
                    'button[customId=learn]': {
                        tap: this.toLearn
                    },
                    'button[customId=amigo]': {
                        element: 'element',
                        delegate: 'a.navigation',
                        tap: this.startLevel
                    }
                });
            },
            
            toLearn: function ()
            {
                var learn =  Ext.create('DrGlearning.view.Learn');
                learn.setHtml('<center>' + this.learnHtml + '</center>');
                learn.setWidth(this.learnWidth);
                learn.setHeight(this.learnHeight + 55);
                Ext.Viewport.add(learn);
                learn.show();
                this.globalSettingsController.learnParent = this.careerFrame;
                this.careerFrame.hide();
            },
            /*
             * Back to installed careers list.
             */
            toCareers: function ()
            {
                localStorage.selectedcareer = 0;
                var view1 = this.careerFrame;
                view1.hide();
                this.careersListController.index();
            },
            /*
             * Showing Career
             */
            tocareer: function ()
            {
                var view1 = this.careerFrame;
                this.daoController.updateOfflineScores();
                view1.show();
            },
            /*
             * Getting the properly Html to show Level icon.
             */
            getLevelHtml: function (career, levelData)
            {
                var filesImgs = ["iletratum.png", "primary.png", "secondary.png", "highschool.png", "college.png", "master.png", "PhD.png", "post-doc.png", "professor.png", "emeritus.png"];
                var html = "<div id='centro' align='middle'><p class='levelTitle'>" + levelData.nameBeauty + "</p><div><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
                if (this.daoController.isApproved(career.data.id, levelData)) {
                    html = "<div id='centro' style='text-align:center;'><p class='levelTitle'>" + levelData.nameBeauty + "</p><div><img style=' position:absolute; top:50px;left: 50%; margin-left: -75px;' src='resources/images/approved-stamp.png' width='150'><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
                } else
                {
                    if (career.data.career_type === "exam") {
                        if (career.data[levelData.name.toLowerCase()] === "exists")
                        {
                            html = "<div id='centro' align='middle'><p class='levelTitle'>" + levelData.nameBeauty + "</p><div><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
                        }
                        if (career.data[levelData.name.toLowerCase()] === "notallowed")
                        {
                            html = "<div id='centro' align='middle'><p class='levelTitle'>" + levelData.nameBeauty + "</p><div><img src='resources/images/padlock.png' align='bottom'></div></div>";
                        }
                    }
                }
                return html;
            },
            /*
             * Update Career View.
             */
            updateCareer: function (newCareer)
            {
                console.log(newCareer);
                this.daoController.updateOfflineScores();
                this.selectedCareer = newCareer;
                var view = this.careerFrame;
                if (typeof(newCareer.data.main) === "undefined" || newCareer.data.main === null) {
                    view.down('button[customId=learn]').hide();
                } else {
                    this.learnHtml = newCareer.data.main.html;
                    this.learnWidth = newCareer.data.main.width;
                    this.learnHeight = newCareer.data.main.height;
                    view.down('button[customId=learn]').show();
                }
                var detail = view.down('careerdetail');
                var description = detail.down('careerdescription');
                var levelscarousel = detail.down('carousel');
                description.setData(newCareer.data);
                var levelstemp = [];
                levelstemp = this.daoController.getLevels('' + newCareer.data.id);
                var items = [];
                var levelButtonHtml;
                this.carousel = levelscarousel;
                levelscarousel.removeAll();
                for (var i = 0; i < levelstemp.length; i++) {
                    var level = this.levelsStore.getAt(levelstemp[i] - 1);
                    levelButtonHtml = this.getLevelHtml(newCareer, level.data);
                    levelscarousel.add({
                        xtype: 'button',
                        html: '<a class="navigation" direction="next">' + levelButtonHtml + '</a>',
                        customId: 'amigo',
                        //I need to deactivate cls because we dont want to show it like button
                        baseCls: 'none'
                    });
                }
                var activeItem = levelstemp.indexOf('' + this.daoController.getCurrenLevel(newCareer.data.id));
                levelscarousel.setActiveItem(activeItem);
                view.down('title[id=title]').setTitle(newCareer.data.name);
                view.show();
            },
            /*
             * Start a Level.
             */
            startLevel: function () {
                /*Ext.Viewport.setMasked({
                    xtype: 'loadmask',
                    message: 'Loading level...',
                    indicator: true
                    //html: "<img src='resources/images/activity_icons/visual.png'>",
                });*/
                var view1 = this.careerFrame;
                var detail = view1.down('careerdetail');
                var levelscarousel = detail.down('carousel');
                this.levelController.updateLevel(this.careersListController.selectedcareer, this.daoController.getLevels(this.careersListController.selectedcareer.data.id)[levelscarousel.getActiveIndex()]);
            }
        });

    // Exceptions Catcher End
    })();
} catch (ex) {
    StackTrace(ex);
}
