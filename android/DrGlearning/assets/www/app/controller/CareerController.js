/**
 * @class DrGlearning.controller.Careers
 * @extends Ext.app.Controller
 *
 * Controller to manage Career Menu and Logic
 */
Ext.define('DrGlearning.controller.CareerController', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.controller.DaoController'],
    views: ['CareerFrame'],
    stores: ['Careers','Levels','Activities','Users'],
    refs: [
	{
        ref: 'careerframe',
        selector: 'careerframe',
        xtype: 'careerframe'
    }, 
	{
        ref: 'levelframe',
        selector: 'levelframe',
        xtype: 'levelframe'
    }, 
	{
        ref: 'activityframe',
        selector: 'activityframe',
        xtype: 'activityframe'
    }],
	flechaizqHtml:"<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><img src='resources/images/flechaizq.png' alt='flecha'></div>",
	flechaderHtml:"<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><img src='resources/images/flecha.png' alt='flecha'></div>",
	/*
	 * Initializate Controller.
	 */
    init: function(){
		this.careersListController=this.getController('CareersListController');
		this.levelController=this.getController('LevelController');
		this.getCareerFrameView().create();
        this.control({
            'button[id=startLevel]': {
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
		console.log(filesImgs[levelData.customId-1]);
		return "<div id='centro' align='middle' ><p align='top'>"+levelData.name + "</p><img src='resources/images/level_icons/"+filesImgs[levelData.customId-1]+"' align='bottom'></div>"
	},
	/*
	 * Update Career View.
	 */
	updateCareer: function(newCareer){
		careerController=this.getController('CareerController');
		var view = this.getCareerframe();
		var detail= view.down('careerdetail');
		var description = detail.down('careerdescription');
        description.setData(newCareer.data);
		var levelscarousel = detail.down('carousel');
		var levelstemp = new Array();
		levelstemp = this.getController('DaoController').getLevels(''+newCareer.data.id);
		var items=[];
		var levelButtonHtml;
		levelscarousel.destroy();
		levelscarousel=Ext.create('Ext.Carousel', {
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
    	});
		for(var i=0;i<levelstemp.length;i++)
		{
		
			
			var level=this.getLevelsStore().getAt(levelstemp[i]-1);
			levelButtonHtml=this.getLevelHtml(level.data);
			if (i == 0) {
				if (i == levelstemp.length - 1) {
					levelscarousel.add({
						xtype: 'panel',
						html: levelButtonHtml,
						listeners: {
	                    tap: function() {
							careerController.startLevel();							
	                    }},
						name: 'a',
					});
				}else
				{
					levelscarousel.add({
						xtype: 'panel',
						html: levelButtonHtml+this.flechaderHtml,
						listeners: {
                    	tap: function() {
							console.log(event);
							if(event.target.parentNode.id=='flechader')
							{
								levelscarousel.next();							
							}
							else
							{
								careerController.startLevel();								
							}
                
                    }},
						name: 'a',
					});
				}
				
			}else if(i == levelstemp.length-1)
			{
				levelscarousel.add({
					xtype: 'panel',
					listeners: {
                    tap: function() {
						console.log(event);
						if(event.target.parentNode.id=='flechaizq')
						{
							levelscarousel.previous();							
						}
						else
						{
							careerController.startLevel();								
						}
                
                    }},
					html: this.flechaizqHtml+levelButtonHtml,
					name: 'a',
				});
			}else
			{
				levelscarousel.add({
					xtype: 'panel',
					name: 'a',
					listeners: {
                    tap: function() {
						console.log(event);
						if(event.target.parentNode.id=='flechaizq')
						{
							levelscarousel.previous();							
						}
						else if(event.target.parentNode.id=='flechader')
						{
							levelscarousel.next();							
						}
						else
						{
							careerController.startLevel();					
						}
                
                    }},
					items:[
						{html:this.flechaizqHtml},
						{html:levelButtonHtml},
						{html:this.flechaderHtml}
					]
                });
			}
		}
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
        this.levelController.updateLevel(this.careersListController.selectedcareer, this.getController('DaoController').getLevels(this.careersListController.selectedcareer.data.id)[levelscarousel.getActiveIndex()]);
        if (this.getCareerframe()) {
            this.getCareerframe().hide();
        }
    }
});
