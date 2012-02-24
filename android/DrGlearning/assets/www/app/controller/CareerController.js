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
			careerframe : 'careerframe',
			levelframe : 'levelframe',
			activityframe: 'activityframe'
	    }
	},
	carousel:null,
	flechaizqHtml:"<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><a href= 'javascript:careerController.carousel.previous();'><img src='resources/images/flechaizq.png' alt='flecha'></a></div>",
	flechaderHtml:"<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><a href= 'javascript:careerController.carousel.next();'><img src='resources/images/flecha.png' alt='flecha'></a></div>",
	/*
	 * Initializate Controller.
	 */
    launch: function(){
		this.careersListController=this.getApplication().getController('CareersListController');
		this.levelController=this.getApplication().getController('LevelController');
		this.daoController=this.getApplication().getController('DaoController');
		Ext.create('DrGlearning.view.CareerFrame');
		var view = this.getCareerframe();
		view.show();
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
	getLevelHtml: function(levelData)
	{
		var filesImgs=["iletratum.png","primary.png","secondary.png","highschool.png","college.png","master.png","PhD.png","post-doc.png","professor.png","emeritus.png"];
		console.log(levelData);
		console.log(filesImgs[levelData.customId-1]);
		return "<div id='centro' align='middle'><p align='top'>"+levelData.name+"</p><a href= 'javascript:careerController.startLevel();'><img src='resources/images/level_icons/"+filesImgs[levelData.customId-1]+"' align='bottom'></a></div>"
	},
	/*
	 * Update Career View.
	 */
	updateCareer: function(newCareer){
		careerController=this.getApplication().getController('CareerController');
		var view = this.getCareerframe();
		var detail= view.down('careerdetail');
		var description = detail.down('careerdescription');
        description.setData(newCareer.data);
		var levelscarousel = detail.down('carousel');
		console.log(levelscarousel);
		var levelstemp = new Array();
		levelstemp = this.getApplication().getController('DaoController').getLevels(''+newCareer.data.id);
		console.log(levelstemp);
		var items=[];
		var levelButtonHtml;
		levelscarousel.removeAll();
		this.carousel=levelscarousel;
		for(var i=0;i<levelstemp.length;i++)
		{
			var level=Ext.getStore('Levels').getAt(levelstemp[i]-1);
			console.log(level);
			levelButtonHtml=this.getLevelHtml(level.data);
			if (i == 0) {
				if (i == levelstemp.length - 1) {
					levelscarousel.add({
						xtype: 'panel',
						html: levelButtonHtml,
						name: 'a',
					});
				}else
				{
				levelscarousel.add({
						xtype: 'panel',
						html: levelButtonHtml+this.flechaderHtml,
						name: 'a',
					});
				}
				
			}else if(i == levelstemp.length-1)
			{
				levelscarousel.add({
					xtype: 'panel',
					html: this.flechaizqHtml+levelButtonHtml,
					name: 'a',
				});
			}else
			{
				levelscarousel.add({
					xtype: 'panel',
					name: 'a',
					html:this.flechaizqHtml+levelButtonHtml+this.flechaderHtml
					
                });
			}
		}
		console.log('me han dado:'+this.daoController.getCurrenLevel(newCareer.data.id));
		console.log(levelstemp);
		var activeItem=levelstemp.indexOf(''+this.daoController.getCurrenLevel(newCareer.data.id));
		levelscarousel.setActiveItem(activeItem);
		detail.add(levelscarousel);
    	view.down('title[id=title]').setTitle(newCareer.data.name);
		view.show();
	},
	/*
	 * Start a Level.
	 */
    startLevel: function(){
		var view1 = this.getCareerframe();
		var detail= view1.down('careerdetail');
		var levelscarousel = detail.down('carousel');
        this.levelController.updateLevel(this.careersListController.selectedcareer, this.getApplication().getController('DaoController').getLevels(this.careersListController.selectedcareer.data.id)[levelscarousel.getActiveIndex()]);
        if (this.getCareerframe()) {
            this.getCareerframe().hide();
        }
    }
});
