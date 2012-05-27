/**
 * @class DrGlearning.controller.Careers
 * @extends Ext.app.Controller
 *
 * Controller to manage Career Menu and Logic
 */

Ext.define('DrGlearning.controller.CareerController', {
    extend: 'Ext.app.Controller',
    xtype:'careercontroller',
    careerFrame: null,
    carousel: null,

    careersListController: null,
    levelController: null,
    daoController: null,
    levelsStore: null,
    selectedCareer : null,
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
        this.control({
            'button[customId=startLevel]': {
                tap: this.startLevel
            },
            'button[id=backToCareers]': {
                tap: this.toCareers
            },
            'button[customId=amigo]': {
                element: 'element',
                delegate: 'a.navigation',
                tap: this.startLevel
            }
        });
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
        view1.show();
    },
    /*
     * Getting the properly Html to show Level icon.
     */
    getLevelHtml: function (career, levelData)
	{
	    console.log("obteniendo nivel: " + levelData.name + ",su estado es: " + career.data[levelData.name.toLowerCase()]);
	    console.log(career);
        var filesImgs = ["iletratum.png", "primary.png", "secondary.png", "highschool.png", "college.png", "master.png", "PhD.png", "post-doc.png", "professor.png", "emeritus.png"];
        var html = "<div id='centro' align='middle'><p class='levelTitle'>" + levelData.name + "</p><div><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
        if (this.daoController.isApproved(career.data.id, levelData)) {
            html = "<div id='centro' style='text-align:center;'><p class='levelTitle'>" + levelData.name + "</p><div><img style=' position:absolute; top:50px;left: 50%; margin-left: -75px;' src='resources/images/approved-stamp.png' width='150'><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
        }else
        {
            if (career.data.career_type === "exam") {
                console.log(career.data[levelData.name.toLowerCase()]);
                if(career.data[levelData.name.toLowerCase()] === "exists")
                {
                    html = "<div id='centro' align='middle'><p class='levelTitle'>" + levelData.name + "</p><div><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
                }
                if(career.data[levelData.name.toLowerCase()] === "notallowed")
                {
                    html = "<div id='centro' align='middle'><p class='levelTitle'>" + levelData.name + "</p><div><img src='resources/images/padlock.png' align='bottom'></div></div>";
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
	    //this.daoController.updateOfflineScores();
	    this.selectedCareer = newCareer;
        var view = this.careerFrame;
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
                xtype:'button',
                html: '<a class="navigation" direction="next">' + levelButtonHtml + '</a>',
                customId:'amigo',
                //I need to deactivate cls because we dont want to show it like button
                baseCls:'none'
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
    startLevel: function(){
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
