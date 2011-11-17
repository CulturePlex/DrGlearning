/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('DrGlearning.controller.Careers', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame','DrGlearning.controller.DaoController','DrGlearning.controller.activities.GeospatialController','DrGlearning.controller.activities.VisualController'],
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
            'button[customId=backtolevel]': {
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
		if (store.getCount() == 0) {
			console.log('lolo');
            view1.down('careerslist').mask('No installed careers');
        }
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
		console.log('ola');
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
			Ext.Msg.confirm("Install Career?","Are you sure you want to install this career?",function(answer,pako){
				//TODO waiting for confirm fix
												//												if (answer == 'yes') {
																									this.getController('DaoController').installCareer(career.data.id, this.installFinished,this);
												//											}
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
		var levelstemp = new Array();
		levelstemp = this.getController('DaoController').getLevels(''+newCareer.data.id);
		levelscarousel.destroy();
		levelscarousel=Ext.create('Ext.Carousel', {
    
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
    	});
		for(var i=0;i<levelstemp.length;i++)
		{
			var level=this.getLevelsStore().getAt(levelstemp[i]-1);
			levelscarousel.add({html:level.data.name});
		}
		detail.add(levelscarousel);
    	view.down('title[id=title]').setTitle(newCareer.data.name);
	},
    addCareer: function(scope){
		if(scope.id!='Careers')
		{
			scope=this;
		}
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
		if (store.getCount() == 0) {
			console.log(store.getCount());
            view12.down('careerslist').mask('No more careers to install');
        }
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
        this.updateLevel(this.selectedcareer, this.getController('DaoController').getLevels(this.selectedcareer.data.id)[levelscarousel.getActiveIndex()]);
        if (this.getCareerframe()) {
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
		var activities = this.getController('DaoController').getActivitiesByLevel(''+newCareer.data.id,''+newLevel);
		activitiescarousel.destroy();
		activitiescarousel=Ext.create('Ext.Carousel', {
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
    	});
		
		for(var i=0;i<activities.length;i++)
		{
			var activity=activities.getAt(i);
			activitiescarousel.setItems({html:activity.data.name,name:'a'});
		}
		detail.add(activitiescarousel);
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
    },
    startActivity: function(){
		var view1 = this.getLevelframe();
		var detail= view1.down('leveldetail');
		var activitiescarousel = detail.down('carousel');
        this.getActivityFrameView().create();
        var view = this.getActivityframe();
        this.updateActivity(activitiescarousel.getActiveIndex());
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        view.show();
    },
	updateActivity: function(newActivityIndex) {
		var view = this.getActivityframe();
		var temp = this.getActivitiesStore().queryBy(function(record) {
			return record.data.level_type==this.selectedlevel && record.data.careerId==this.selectedcareer.data.id ;
		},this);
		newActivity = temp.items[newActivityIndex];
		view.down('title[id=title]').setTitle(newActivity.data.name);
		var activityView;
		if (newActivity.data.activity_type == 'geospatial') {
			this.getController('activities.GeospatialController').updateActivity(view,newActivity);
		}else if (newActivity.data.activity_type == 'visual') {
			this.getController('activities.VisualController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'relational'){
			this.getController('activities.RelationalController').updateActivity(view,newActivity);
		}else{
			activityView=Ext.create('DrGlearning.view.activities.ActivityContent');
			view.add(activityView);
			var content =view.down('activitycontent');
			content.setHtml(this.getData(newActivity));
	    }
		},
    getData:function(newActivity) {
		var html="";
		for(cont in newActivity.data){
			html=html+" "+cont+":"+newActivity.data[cont]+"</br>"
		}
		return html;
	}
});
