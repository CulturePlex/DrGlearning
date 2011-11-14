/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('DrGlearning.controller.Careers', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame'],
    views: ['Main', 'CareerFrame', 'CareersFrame', 'LevelFrame', 'CareersList', 'ActivityFrame'],
    stores: ['Careers','Levels','Activities'],
    refs: [{
        ref: 'main',
        selector: 'mainview',
        autoCreate: true,
        xtype: 'mainview'
    }, {
        ref: 'careerframe',
        selector: 'careerframe',
        xtype: 'careerframe'
    }, {
        ref: 'levelframe',
        selector: 'levelframe',
        xtype: 'levelframe'
    }, {
        ref: 'activityframe',
        selector: 'activityframe',
        xtype: 'activityframe'
    }, {
        ref: 'careersframe',
        selector: 'careersframe',
        xtype: 'careersframe'
    }],
    selectedcareer: null,
	selectedlevel: null,
    initializate: function(){
        this.getMainView().create();
        this.control({
            'careerslistitem': {
                tap: this.onListTap
            },
            'button[id=back]': {
                tap: this.index
            },
            'button[id=backtocareer]': {
                tap: this.tocareer
            },
            'button[id=backtolevel]': {
                tap: this.tolevel
            },
            'button[id=addCareer]': {
                tap: this.addCareer
            },
            'button[id=backToAdd]': {
                tap: this.addCareer
            },
            'button[id=startLevel]': {
                tap: this.startLevel
            },
            'button[id=startActivity]': {
                tap: this.startActivity
            },
            'searchfield[id=searchbox]': {
                change: this.search
            },
            'selectfield[name=state]': {
                change: this.filterCareers
            }
        });
        
        this.index();
    },
    index: function(){
		this.getCareerFrameView().create();
        var view = this.getCareerframe();
        if (view) {
            view.hide();
        }
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter("installed", "true");
        var view1 = this.getCareersframe();
        if (view1) {
            view1.hide();
        }
        this.getCareersFrameView().create();
        var view1 = this.getCareersframe();
        view1.down('careerslist').refresh();
        this.filterCareers();
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarTopAdd]').hide();
        view1.down('toolbar[id=toolbarBottomAdd]').hide();
        view1.show();
    },
	installFinished: function(scope){
		if(scope.id!='Careers')
		{
			scope=this;
		}
		scope.index();
    },
    filterCareers: function(){
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter("installed", "true");
        var view1 = this.getCareersframe();
        if (view1.down('selectfield[name=state]').getValue() == 'notYet') {
            store.filter("started", "false");
        }
        if (view1.down('selectfield[name=state]').getValue() == 'inProgress') {
            store.filter("started", "true");
        }
        store.load();
        view1.down('careerslist').refresh();
    },
    tocareer: function(){
		
        if (this.getCareersframe()) {
            this.getCareersframe().hide();
        }
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        var view1 = this.getCareerframe();
        view1.show();
    },
    tolevel: function(){
		
        if (this.getCareerframe()) {
            this.getCareerframe().hide();
        }
        if (this.getActivityframe()) {
            this.getActivityframe().hide();
        }
        var view1 = this.getLevelframe();
        view1.show();
    },
    onListTap: function(list, career){
		this.selectedcareer=career;
		if (career.data.installed == "false") 
		{
			Ext.Msg.confirm("Install Career?","Are you sure you want to install this career?",function(answer){
																								if (answer == 'yes') {
																									this.getController('DaoController').installCareer(career.data.id, this.installFinished,this);
																								}
																									},this);

		}
		else 
		{
			this.getCareerFrameView().create();
			var view = this.getCareerframe();
			this.updateCareer(career);
			this.getCareersframe().hide();
			view.show();
		}
    },
	updateCareer: function(newCareer){
		var view = this.getCareerframe();
		var detail= view.down('careerdetail');
		var description = detail.down('careerdescription');
        description.setData(newCareer.data);
		var levelscarousel = detail.down('carousel');
		levelscarousel.removeAt(0);
		var levelstemp = new Array();
		for(var i=0;i<this.getController('DaoController').getLevels(''+newCareer.data.id);i++)
		{
			console.log(this.getLevelsStore());
			var level=this.getLevelsStore().getAt(i);
			levelstemp.push({html:level.data.name,name:'a'});
		}
		levelscarousel.setItems(levelstemp);
		levelscarousel.refresh();
    	view.down('title[id=title]').setTitle(newCareer.data.name);
	},
    addCareer: function(scope){
		console.log(scope);
		if(scope.id!='Careers')
		{
			scope=this;
		}
		console.log(scope);
        var store = scope.getCareersStore();
        store.clearFilter();
        store.filter('installed', 'false');
        var caca = scope.getCareersFrameView().create();
        caca.destroy();
        var view12 = scope.getCareersframe();
        var view = scope.getCareerframe();
        if (view) {
            view.hide();
        }
        view12.down('careerslist').refresh();
        view12.down('toolbar[id=toolbarTopNormal]').hide();
        view12.down('toolbar[id=toolbarTopAdd]').show();
        view12.down('toolbar[id=toolbarBottomAdd]').show();
        view12.show();
    },
    startLevel: function(){
		var view1 = this.getCareerframe();
		var detail= view1.down('careerdetail');
		var levelscarousel = detail.down('carousel');
        this.getLevelFrameView().create();
        var view = this.getLevelframe();
		console.log(levelscarousel.getActiveIndex());
        this.updateLevel(this.selectedcareer, levelscarousel.getActiveIndex());
        if (this.getCareerframe()) {
            console.log("borrando");
            this.getCareerframe().hide();
        }
        view.show();
    },
	updateLevel: function(newCareer,newLevel) {
		this.selectedlevel=newLevel;
		var view = this.getLevelframe();
		var detail= view.down('leveldetail');
		var description = detail.down('leveldescription');
		var level=this.getLevelsStore().getAt(newLevel);
		description.setHtml('Nivel '+level.data.name+':'+level.data.description);
		var activitiescarousel = detail.down('carousel');
		var activities = this.getController('DaoController').getActivitiesByLevel(''+newCareer.data.id,''+(newLevel+1));
		var activitiestemp = new Array();
		for(var i=0;i<activities.length;i++)
		{
			var activity=activities.getAt(i);
			activitiestemp.push({html:activity.data.name,name:'a'});
		}
		console.log(activitiestemp);
		activitiescarousel.setItems(activitiestemp);
		activitiescarousel.refresh();
		view.down('title[id=title]').setTitle(newCareer.data.name);
    },
    search: function(values, form){
        form = form.toLowerCase();
        var store = this.getCareersStore();
        var filters = [];
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.installed == 'false';
            }
        }));
        filters.push(new Ext.util.Filter({
            filterFn: function(item){
                return item.data.name.toLowerCase().indexOf(form) != -1 || item.data.description.toLowerCase().indexOf(form) != -1;
            }
        }));
        store.clearFilter();level
        store.filter(filters);
        store.load();
        var view12 = this.getCareersframe();
        view12.down('careerslist').refresh();
        console.log(view12.down('careerslist'));
    },
    startActivity: function(){
		var view1 = this.getLevelframe();
		var detail= view1.down('leveldetail');
		var activitiescarousel = detail.down('carousel');
        this.getActivityFrameView().create();
        var view = this.getActivityframe();
		console.log('en el carrusel:'+activitiescarousel.getActiveIndex());
		
        this.updateActivity(activitiescarousel.getActiveIndex());
        if (this.getLevelframe()) {
            console.log("borrando");
            this.getLevelframe().hide();
        }
        view.show();
    },
	updateActivity: function(newActivityIndex) {
		var view = this.getActivityframe();
		var temp = this.getActivitiesStore().queryBy(function(record) {
			return record.data.level_type==this.selectedlevel+1 && record.data.careerId==this.selectedcareer.data.id ;
		},this);
		console.log(newActivityIndex);
		console.log(temp);
		newActivity = temp.items[newActivityIndex-1];
		console.log(newActivity);
		view.down('title[id=title]').setTitle(newActivity.data.name);
		var activityView;
		if (newActivity.data.activity_type == 'geospatial') {
			activityView = Ext.create('DrGlearning.view.activities.Geospatial');
			activityView.down('title[id=query]').setTitle(newActivity.data.query);
			view.add(activityView);
						
		}
		if (newActivity.data.activity_type == 'visual') {
			activityView = Ext.create('DrGlearning.view.activities.Visual');
			activityView.down('panel[id=image]').setHtml('<img alt="imagen" src="'+newActivity.data.image+'" />');
			view.add(activityView);
						
		}
		if(newActivity.data.activity_type != 'visual' || newActivity.data.activity_type != 'geospatial')
		{
			activityView=Ext.create('DrGlearning.view.activities.ActivityContent');
			view.add(activityView);
			var content =view.down('activitycontent');
			content.setHtml(
				'id :'+newActivity.data.id+','+
				'name :'+newActivity.data.name+','+
				'careerId :'+newActivity.data.careerId+','+
				'activity_type :'+newActivity.data.activity_type+','+
				'languade_code :'+newActivity.data.landuade_code+','+
				'level_type :'+newActivity.data.level_type+','+
				'level_order :'+newActivity.data.level_order+','+
				'level_required :'+newActivity.data.level_required+','+
				'query :'+newActivity.data.query+','+
				'timestamp :'+newActivity.data.timestamp+','+
				'resource_uri :'+newActivity.data.resource_uri+','+
				'image :'+newActivity.data.image+','+
				'image_datetime :'+newActivity.data.image_datetime+','+
				'query_datatime :'+newActivity.data.query_datatime+','+
				'locked_text :'+newActivity.data.locked_text+','+
				'answer :'+newActivity.data.answer+','+
				'id :'+newActivity.data.id+',');
			}
	    }
    
});
