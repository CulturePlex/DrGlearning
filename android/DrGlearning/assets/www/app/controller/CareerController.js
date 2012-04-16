/**
 * @class DrGlearning.controller.Careers
 * @extends Ext.app.Controller
 *
 * Controller to manage Career Menu and Logic
 */
Ext.define('DrGlearning.controller.CareerController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            careerframe: 'careerframe',
            levelframe: 'levelframe',
            activityframe: 'activityframe'
        }
    },
    carousel: null,
	/*
    flechaizqHtml: "",//"<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><a href= 'javascript:careerController.carousel.previous();'><img src='resources/images/arrowleft.png' alt='flecha' height=30></a></div>",
    flechaderHtml: "",//"<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><a href= 'javascript:careerController.carousel.next();'><img src='resources/images/arrowright.png' alt='flecha' height=30></a></div>",
    */
    /*
     * Initializate Controller.
     */
    launch: function(){
        this.careersListController = this.getApplication().getController('CareersListController');
        this.levelController = this.getApplication().getController('LevelController');
        this.daoController = this.getApplication().getController('DaoController');
        Ext.create('DrGlearning.view.CareerFrame');
        this.control({
            'button[customId=startLevel]': {
                tap: this.startLevel
            },
            'button[id=backToCareers]': {
                tap: this.toCareers
            },
        });
    },
    /*
     * Back to installed careers list.
     */
    toCareers: function(){
        var view1 = this.getCareerframe();
        view1.hide();
        this.careersListController.index();
    },
    /*
     * Showing Career
     */
    tocareer: function(){
        var view1 = this.getCareerframe();
        view1.show();
    },
    /*
     * Getting the properly Html to show Level icon.
     */
    getLevelHtml: function(career,levelData){
        var filesImgs = ["iletratum.png", "primary.png", "secondary.png", "highschool.png", "college.png", "master.png", "PhD.png", "post-doc.png", "professor.png", "emeritus.png"];
		var html = "<div id='centro' align='middle'><p>" + levelData.name + "</p><div><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
		if (this.getApplication().getController('DaoController').isApproved(career,levelData))
		{
			html = "<div id='centro' align='middle'><p>" + levelData.name + "</p><div><img style=' position:absolute; top:50px; right:100px;' src='resources/images/approved-stamp.png' width='150'><img src='resources/images/level_icons/" + filesImgs[levelData.customId - 1] + "' align='bottom'></div></div>";
		}
		console.log(levelData);
        return html;
    },
    /*
     * Update Career View.
     */
    updateCareer: function(newCareer){
        careerController = this.getApplication().getController('CareerController');
        var view = this.getCareerframe();
        var detail = view.down('careerdetail');
        var description = detail.down('careerdescription');
		var levelscarousel = detail.down('carousel');
        description.setData(newCareer.data);
        var levelstemp = new Array();
        levelstemp = this.getApplication().getController('DaoController').getLevels('' + newCareer.data.id);
        var items = [];
        var levelButtonHtml;
        this.carousel = levelscarousel;
		levelscarousel.removeAll();
        for (var i = 0; i < levelstemp.length; i++) {
            var level = Ext.getStore('Levels').getAt(levelstemp[i] - 1);
            console.log(level);
            levelButtonHtml = this.getLevelHtml(newCareer.data.id,level.data);
            levelscarousel.add({
                html: '<a class="navigation" direction="next">' + levelButtonHtml + '</a>',
            
            });
            /**
             I used it to paint the correct arows
             
             if (i == 0) {
             if (i == levelstemp.length - 1) {
             levelscarousel.add({
             html: levelButtonHtml,
             name: 'a',
             cls:'card dark',
             customId: 'levelIcon'
             });
             }else
             {
             levelscarousel.add({
             html: levelButtonHtml+this.flechaderHtml,
             name: 'a',
             cls:'card dark',
             customId: 'levelIcon'
             });
             }
             
             }else if(i == levelstemp.length-1)
             {
             levelscarousel.add({
             html: this.flechaizqHtml+levelButtonHtml,
             name: 'a',
             cls:'card dark',
             customId: 'levelIcon'
             });
             }else
             {
             levelscarousel.add({
             name: 'a',
             html:this.flechaizqHtml+levelButtonHtml+this.flechaderHtml,
             cls:'card dark',
             customId: 'levelIcon'
             });
             }*/
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
		Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Loading level...',
            indicator: true,
            //html: "<img src='resources/images/activity_icons/visual.png'>",
        });
        var view1 = this.getCareerframe();
        var detail = view1.down('careerdetail');
        var levelscarousel = detail.down('carousel');
        this.getApplication().getController('LevelController').updateLevel(this.careersListController.selectedcareer, this.getApplication().getController('DaoController').getLevels(this.careersListController.selectedcareer.data.id)[levelscarousel.getActiveIndex()]);
        if (this.getCareerframe()) {
            this.getCareerframe().hide();
        }
    }
});
