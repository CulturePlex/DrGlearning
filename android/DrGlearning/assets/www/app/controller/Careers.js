/**
 * @class Kiva.controller.Loans
 * @extends Ext.app.Controller
 *
 * The only controller in this simple application - this simply sets up the fullscreen viewport panel
 * and renders a detailed overlay whenever a Loan is tapped on.
 */
Ext.define('DrGlearning.controller.Careers', {
    extend: 'Ext.app.Controller',
    requires: ['DrGlearning.store.Careers','DrGlearning.store.Levels','DrGlearning.view.CareersFrame','DrGlearning.controller.DaoController','DrGlearning.controller.activities.GeospatialController','DrGlearning.controller.activities.TemporalController','DrGlearning.controller.activities.VisualController','DrGlearning.view.Settings'],
    views: ['Main', 'CareerFrame', 'CareersFrame', 'LevelFrame', 'CareersList', 'ActivityFrame', 'Settings'],
    stores: ['Careers','Levels','Activities','Users'],
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
    }, {
        ref: 'settings',
        selector: 'settings',
        xtype: 'settings'
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
            },
            'button[id=settings]': {
                tap: this.settings
                
            },
            'button[id=save]': {
                tap: this.saveSettings
                
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
		//console.log(view1.getItems());
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
			if (i == 0) {
				if (i == levelstemp.length - 1) {
					levelscarousel.setItems({
						html: "<div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + level.data.name + "</div>",
						name: 'a'
					});
				}else
				{
					levelscarousel.setItems({
						html: "<div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + level.data.name + "</div><div style='position:absolute;top:0;right:0'><img src='/resources/images/flecha_negra.png' alt='flecha'>",
						name: 'a'
					});
				}
				
			}else if(i == levelstemp.length-1)
			{
				levelscarousel.setItems({
					html: "<div><img src='/resources/images/flechaizq.png' alt='flecha'></div><div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + level.data.name +"</div>",
					name: 'a'
				});
			}else
			{
				levelscarousel.setItems({
					html: "<div><img src='/resources/images/flechaizq.png' alt='flecha'></div><div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + level.data.name + "</div><div style='position:absolute;top:0;right:0'><img src='/resources/images/flecha_negra.png' alt='flecha'></div>",
					name: 'a'
				});
			}
		}
		detail.add(levelscarousel);
    	view.down('title[id=title]').setTitle(newCareer.data.name);
	},
    addCareer: function(scope){
		
		if(scope.id!='Careers')
		{
			scope=this;
		}
		var caca = scope.getCareersFrameView().create();
        caca.destroy();
        var view12 = scope.getCareersframe();
        var view = scope.getCareerframe();
        if (view) {
            view.hide();
        }
        view12.down('careerslist').refresh();
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
        console.log("Q pasa? "+this.loading);
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
		var level=this.getLevelsStore().getAt(newLevel-1);
		description.setHtml('<b>'+level.data.name+' Level: </b>'+level.data.description+'<div style="position:absolute;margin:0 auto 0 auto; width:100%;bottom:50%;">Activities:</div>');
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
			if (i == 0) {
				if (i == activities.length - 1) {
					activitiescarousel.setItems({
						html: "<div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + activity.data.name + "</div>",
						name: 'a'
					});
				}else
				{
					activitiescarousel.setItems({
						html: "<div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + activity.data.name + "</div><div style='position:absolute;top:0;right:0'><img src='/resources/images/flecha_negra.png' alt='flecha'>",
						name: 'a'
					});
				}
				
			}else if(i == activities.length-1)
			{
				activitiescarousel.setItems({
					html: "<div><img src='/resources/images/flechaizq.png' alt='flecha'></div><div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + activity.data.name +"</div>",
					name: 'a'
				});
			}else
			{
				activitiescarousel.setItems({
					html: "<div><img src='/resources/images/flechaizq.png' alt='flecha'></div><div align='center' style='position:absolute;margin:0 auto 0 auto; width:100%;top:0;'>" + activity.data.name + "</div><div style='position:absolute;top:0;right:0'><img src='/resources/images/flecha_negra.png' alt='flecha'></div>",
					name: 'a'
				});
			}
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
		console.log(newActivity.data.activity_type);
		if (newActivity.data.activity_type == 'geospatial') {
			this.getController('activities.GeospatialController').updateActivity(view,newActivity);
		}else if (newActivity.data.activity_type == 'visual') {
			this.getController('activities.VisualController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'relational'){
			this.getController('activities.RelationalController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'temporal'){
			this.getController('activities.TemporalController').updateActivity(view,newActivity);
		}else{
			view.down('component[id=activity]').destroy();
			activityView=Ext.create('DrGlearning.view.activities.ActivityContent');			
			view.add(activityView);
			console.log(activityView);
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
	},
	settings:function(){
		var userStore=this.getUsersStore();
		userStore.load();
		this.getSettingsView().create();
        var view = this.getSettings();
        view.show();
        var hashField=view.down('textfield[id=hash]');
        var usernameField=view.down('textfield[id=username]');
        var emailField=view.down('textfield[id=email]');
        var user=userStore.first();
        emailField.setValue(user.data.email);
        usernameField.setValue(user.data.name);
        hashField.setValue(user.data.uniqueid);
    },
    saveSettings:function(){
    	var userStore=this.getUsersStore();
		userStore.load();
		var view = this.getSettings();
		var hashField=view.down('textfield[id=hash]').getValue();
        var usernameField=view.down('textfield[id=username]').getValue();
        var emailField=view.down('textfield[id=email]').getValue();
        var user=userStore.first();
        user.set('uniqueid',hashField);
        user.set('name',usernameField);
        user.set('email',emailField);
        user.save();
		userStore.sync();
		view.hide();
		
    }
});
