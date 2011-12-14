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
	knowledgeFields: null,
	flechaizqHtml:"<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><img src='resources/images/flechaizq.png' alt='flecha'></div>",
	flechaderHtml:"<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><img src='resources/images/flecha.png' alt='flecha'></div>",
    initializate: function(){
		this.getController('activities.VisualController').initializate();
		this.getController('activities.GeospatialController').initializate();
		this.getController('activities.TemporalController').initializate();
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
                tap: this.startActivityFromCarousel
            },
            'searchfield[id=searchbox]': {
                change: this.search
            },
            'selectfield[name=state]': {
                change: this.filterCareers
            },
			/*'selectfield[name=knnowledge_field]': {
                change: this.filterCareersByKnowledge
            },*/
            'button[id=settings]': {
                tap: this.settings
                
            },
            'button[id=save]': {
                tap: this.saveSettings
                
            },
            'button[id=export]': {
                tap: this.exportUser
                
            },
            'button[id=import]': {
                tap: this.importUser
                
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
		if (store.getCount() == 0) {
			console.log(store.getCount());
            view1.down('careerslist').mask('No installed careers, please click on Add Career button to start!');
        }
		
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarBottomSettings]').show();
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
	/*filterCareersByKnowledge: function(){
        var store = this.getCareersStore();
        store.clearFilter();
        store.filter("installed", "false");
        var view1 = this.getCareersframe();
		store.filter("started", "false");
        if (view1.down('selectfield[name=knnowledge_field]').getValue() == 'notYet') {
            store.filter("started", "false");
        }
        if (view1.down('selectfield[name=state]').getValue() == 'inProgress') {
            store.filter("started", "true");
        }
        store.load();
        view1.down('careerslist').refresh();
    },*/
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
	getLevelHtml: function(levelData)
		{
			var filesImgs=["iletratum.png","primary.png","secondary.png","highschool.png","college.png","master.png","PhD.png","PhD.png","PhD.png","PhD.png"];
			console.log(filesImgs[levelData.customId-1]);
			return "<div id='centro' align='middle' ><p align='top'>"+levelData.name + "</p><img src='resources/images/level_icons/"+filesImgs[levelData.customId-1]+"' align='bottom'></div>"
		}
		,
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
    		layout: {
            type: 'vbox',
            align: 'stretch'
        },
        	xtype: 'carousel',
            ui: 'light',
            direction: 'horizontal',
    	});
		var carouselcolor='0x1c7e29';
		
		var levelButtonHtml;
		
		for(var i=0;i<levelstemp.length;i++)
		{
		
			
			var level=this.getLevelsStore().getAt(levelstemp[i]-1);
			levelButtonHtml=this.getLevelHtml(level.data);
			//levelButtonHtml = this.getLevelHtml(level.data);
			if (i == 0) {
				if (i == levelstemp.length - 1) {
					levelscarousel.setItems({
						html: levelButtonHtml,
						listeners: {
	                    tap: function() {
							console.log(event);
							if(event.target.parentNode.id=='centro')
							{
								//this.startLevel();							
							}
	                
	                    }},
						name: 'a',
					});
				}else
				{
					levelscarousel.setItems({
						html: levelButtonHtml+this.flechaderHtml,
						listeners: {
                    	tap: function() {
							console.log(event);
							if(event.target.parentNode.id=='flechader')
							{
								levelscarousel.next();							
							}
							if(event.target.parentNode.id=='centro')
							{
								//this.startLevel;							
							}
                
                    }},
						name: 'a',
					});
				}
				
			}else if(i == levelstemp.length-1)
			{
				levelscarousel.setItems({
					listeners: {
                    tap: function() {
						console.log(event);
						if(event.target.parentNode.id=='flechaizq')
						{
							levelscarousel.previous();							
						}
						if(event.target.parentNode.id=='centro')
						{
							//this.startLevel();							
						}
                
                    }},
					html: this.flechaizqHtml+levelButtonHtml,
					name: 'a',
				});
			}else
			{
				levelscarousel.setItems({
					
					name: 'a',
					listeners: {
                    tap: function() {
						console.log(event);
						if(event.target.parentNode.id=='flechaizq')
						{
							levelscarousel.previous();							
						}
						if(event.target.parentNode.id=='flechader')
						{
							levelscarousel.next();							
						}
						if(event.target.parentNode.id=='centro')
						{
							//this.startLevel();							
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
		
	
		//console.log(detail.down('div'));
    	view.down('title[id=title]').setTitle(newCareer.data.name);
	},
    addCareer: function(scope){
		//knowledgeFields = this.getController('DaoController').getknowledgesFields();
		knowledgeFields = ["Materia 1","Materia 2"];
		console.log(knowledgeFields);
		
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
		options=[];
		for (var i = 0; i < knowledgeFields.length; i++) {
			options.push({text: knowledgeFields[i], value: knowledgeFields[i]});
		}
		view12.down('selectfield[name=knnowledge_field]').setOptions(options);
				
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
        view12.down('toolbar[id=toolbarBottomSettings]').hide();
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
		console.log(newLevel);
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
		var flechaizqHtml=this.flechaizqHtml;
		var flechaderHtml=this.flechaderHtml;
		//var currentLevel = this.getController('DaoController').getCurrenLevel(this.selectedcareer.internalId);
		//console.log(this.selectedcareer);
		var currentActivity = this.getController('DaoController').getCurrenActivity(this.selectedcareer.data.id,newLevel);
		var startingIndex=0;
		for(var i=0;i<activities.length;i++)
		{
			var activity=activities.getAt(i);
			console.log(currentActivity);
			console.log(activity);
			if(activity.internalId==currentActivity-1){
				startingIndex=i;
				
			}
			
			
			var iconoactivityHtml = "<div align='center' style='position:absolute;margin:0 auto 0 auto; width:70%;top:0;left:15%;'>" + activity.data.name + "</div>";
			if(activity.data.successful)
			{
				iconoactivityHtml = "<div align='center' style='position:absolute;margin:0 auto 0 auto;height:100%; width:70%;top:0;left:15%;background-color:#999999;'>" + activity.data.name + "<div bottom='0'>Score: " + activity.data.score + "<img src=resources/images/tick.png></div></div>";
			}
			if (i == 0) {
				if (i == activities.length - 1) {
					activitiescarousel.setItems({
						listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}
		                
		                    }},
						html: iconoactivityHtml,
						name: 'a'
					});
				}else
				{
					activitiescarousel.setItems({
						listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}
		                
		                    }},
						html: iconoactivityHtml + flechaderHtml,
						name: 'a'
					});
				}
				
			}else if(i == activities.length-1)
			{
				activitiescarousel.setItems({
					listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}
		                
		                    }},
					html: flechaizqHtml + iconoactivityHtml,
					name: 'a'
				});
			}else
			{
				activitiescarousel.setItems({
					listeners: {
		                    tap: function() {
								console.log(event);
								if(event.target.parentNode.id=='flechaizq')
								{
									activitiescarousel.previous();							
								}
								if(event.target.parentNode.id=='flechader')
								{
									activitiescarousel.next();							
								}
								if(event.target.parentNode.id=='centro')
								{
									//this.startLevel();							
								}
		                
		                    }},
					html: flechaizqHtml + iconoactivityHtml + flechaderHtml,
					name: 'a'
				});
			}
		}
		
		console.log(currentActivity);
		console.log(activitiescarousel);
		activitiescarousel.setActiveItem(startingIndex);
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
    startActivityFromCarousel: function(){
		var view1 = this.getLevelframe();
		var detail= view1.down('leveldetail');
		var activitiescarousel = detail.down('carousel');
        this.getActivityFrameView().create();
        var view = this.getActivityframe();
		var temp = this.getActivitiesStore().queryBy(function(record) {
			return record.data.level_type==this.selectedlevel && record.data.careerId==this.selectedcareer.data.id ;
		},this);
		tempActivity = temp.items[activitiescarousel.getActiveIndex()];
		console.log(tempActivity);
        this.updateActivity(tempActivity.data.id);
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        view.show();
    },
	startActivity: function(idActivity){
		var view1 = this.getLevelframe();
		var detail= view1.down('leveldetail');
		var activitiescarousel = detail.down('carousel');
        this.getActivityFrameView().create();
        var view = this.getActivityframe();
        this.updateActivity(idActivity);
        if (this.getLevelframe()) {
            this.getLevelframe().hide();
        }
        view.show();
	},
	nextActivity: function(){
		var currentLevel = this.getController('DaoController').getCurrenLevel(this.selectedcareer.data.id);
		//console.log(this.selectedcareer.internalId);
		var currentActivity = this.getController('DaoController').getCurrenActivity(this.selectedcareer.data.id,currentLevel);
		console.log(currentActivity);
		this.startActivity(currentActivity);
		
	},
	updateActivity: function(newActivityId) {
		var view = this.getActivityframe();
		console.log(newActivityId);
		var temp = this.getActivitiesStore().queryBy(function(record) {
			return record.data.id==newActivityId;
		},this);
		//newActivity = temp.items[newActivityIndex];
		console.log(temp);
		newActivity=temp.items[0]; 
		view.down('title[id=title]').setTitle(newActivity.data.name);
		var activityView;
		console.log(newActivity.data.activity_type);
		if (newActivity.data.activity_type == 'geospatial') {
			console.log(navigator.network);
			console.log(navigator.network.connection.type);
			if (navigator.network != undefined && navigator.network.connection.type == Connection.NONE) {
				Ext.Msg.alert('No Internet', 'There is not connection to Internet, you cant start this activity!', function(){
				this.getController('Careers').tolevel();
			}, this);
			}else{
				
				this.getController('activities.GeospatialController').updateActivity(view, newActivity);
			}
		}else if (newActivity.data.activity_type == 'visual') {
			this.getController('activities.VisualController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'relational'){
			this.getController('activities.RelationalController').updateActivity(view,newActivity);
		}else if(newActivity.data.activity_type == 'temporal'){
			this.getController('activities.TemporalController').updateActivity(view,newActivity);
		
		//else if(newActivity.data.activity_type == 'linguistic'){
		//	this.getController('activities.LinguisticController').updateActivity(view,newActivity);
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
        var usernameField=view.down('textfield[id=username]');
        var emailField=view.down('textfield[id=email]');
        var user=userStore.first();
        emailField.setValue(user.data.email);
        usernameField.setValue(user.data.name);
    },
    saveSettings:function(){
    	var userStore=this.getUsersStore();
		userStore.load();
		var view = this.getSettings();
        var usernameField=view.down('textfield[id=username]').getValue();
        var emailField=view.down('textfield[id=email]').getValue();
        var user=userStore.first();
        user.set('name',usernameField);
        user.set('email',emailField);
        user.save();
		userStore.sync();
		view.hide();
	},
	exportUser:function(){
		var userStore=this.getUsersStore();
		userStore.load();
		var user=userStore.first();
		var view = this.getSettings();
		view.hide();
		var textField=Ext.create('Ext.field.Text', {
		    value: user.data.uniqueid,
		    readOnly:true,
		    clearIcon:false,
		});
		new Ext.MessageBox().show({  
	        title: 'Export user',  
	        msg: 'Copy and paste in your new device:',  
	        items:textField ,
	        multiline: true,
	        buttons: Ext.Msg.OK,  
	        icon: Ext.Msg.INFO  
	    });
	    
	},
	importUser:function(){
		var userStore=this.getUsersStore();
		userStore.load();
		var user=userStore.first();
		var view = this.getSettings();
		view.hide();
		var textField=Ext.create('Ext.field.Text', {
		    value: '',
		    clearIcon:false,
		});
		var saveButton=Ext.create('Ext.Button', {
			scope:this,
			text: 'Save',
		});
		var cancelButton=Ext.create('Ext.Button', {
			scope:this,
		    text: 'Cancel',
		});
	    var show=new Ext.MessageBox().show({  
	    	id:'pako',
	        title: 'Import user',  
	        msg: 'Paste your previous ID:',  
	        items:textField ,
	        buttons: [cancelButton,saveButton],  
	        icon: Ext.Msg.INFO,   
	    });
	    console.log(show);
	    saveButton.setHandler(function(){
	    	show.hide();
	    	user.data.uniqueid=textField.getValue();
	    	user.save();
			userStore.sync();
	    });
	    cancelButton.setHandler(function(){
	    	show.hide();
	    	this.destroy(show);
	    });
	},
	importUserAction:function(ola,adios){
		console.log(ola);
    	console.log(adios);
    },
});
