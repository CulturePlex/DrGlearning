/**
 * @class DrGlearning.controller.CareersListController
 * @extends Ext.app.Controller
 *
 * Controller to manage Careers List Menu and Logic.
 */
Ext.define('DrGlearning.controller.CareersListController', {
    extend: 'Ext.app.Controller',
    requires: [
               'DrGlearning.view.Main',
    ], 
    config: {
    	refs: {
    		mainView : 'mainview',
    		careersframe:  'careersframe',
    		settings : 'settings',
        }
    },
    selectedcareer: null,
	selectedlevel: null,
	knowledgeFields: null,
	flechaizqHtml:"<div id='flechaizq' style='position:absolute;top:50%; margin-top:-23px;'><img src='resources/images/flechaizq.png' alt='flecha'></div>",
	flechaderHtml:"<div id='flechader' style='position:absolute;right:0; top:50%; margin-top:-23px;'><img src='resources/images/flecha.png' alt='flecha'></div>",
	/*
	 * Initializate Controller.
	 */
    initializate: function(){
		document.body.style.background="";
		console.log(document.body.style.background);
		this.careerController=this.getApplication().getController('CareerController');
		this.levelController=this.getApplication().getController('LevelController');
		this.daoController=this.getApplication().getController('DaoController');
		console.log(this);
		Ext.create('DrGlearning.view.Main');
        this.control({
            'careerslistitem': {
                tap: this.addOrStartCareer
            },
            'button[id=addCareer]': {
                tap: this.addCareer
            },
			'button[customId=addCareer]': {
                tap: this.addCareer
            },
            'searchfield[id=searchbox]': {
                change: this.search
            },
            'selectfield[name=state]': {
                change: this.filterCareers
            },
			'button[id=back]': {
                tap: this.index
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
	/*
	 * Showing Installed Careers.
	 */
    index: function(){
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", "true");
        var view1 = this.getCareersframe();
        if (view1) {
            view1.hide();
        }
        Ext.create('DrGlearning.view.CareersFrame');
        var view1 = this.getCareersframe();
        this.filterCareers();
		view1.down('careerslistempty').hide();
		if (store.getCount() == 0) {
			view1.down('careerslist').hide();
			view1.down('careerslistempty').show();
        }
        view1.down('toolbar[id=toolbarTopNormal]').show();
        view1.down('toolbar[id=toolbarBottomSettings]').show();
        view1.down('toolbar[id=toolbarTopAdd]').hide();
        view1.down('toolbar[id=toolbarBottomAdd]').hide();
		//console.log(view1.getItems());
        view1.show();
    },
	/*
	 * Method call when tap on a Carrer Item in the list.
	 */
	addOrStartCareer: function(list, career){
		this.selectedcareer=career;
		if (career.data.installed == "false") 
		{
			//Ext.Msg.confirm("Install Career?","Are you sure you want to install this career?",function(answer,pako){
				
																								//if (answer == 'yes') {
																									this.getApplication().getController('DaoController').installCareer(career.data.id, this.installFinished,this);
																							//}
																									//},this);
		}
		else 
		{
			this.careerController.updateCareer(career);
			this.getCareersframe().hide();
		}
    },
	/*
	 * Callback function for Career install finished. 
	 */
	installFinished: function(scope){
		/*
		 *if(scope.id!='Careers')
		{
			scope=this;
		}*/
		scope.index();
    },
	/*
	 * Filer Careers by started/not started atribute.
	 */
    filterCareers: function(){
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter("installed", "true");
        var view1 = this.getCareersframe();
		console.log(view1);
		var careerStateSelected=Ext.ComponentQuery.query('selectfield[name=state]')[0];
		console.log(careerStateSelected);
        if (careerStateSelected.getValue() == 'notYet') {
            store.filter("started", "false");
        }
        if (careerStateSelected.getValue() == 'inProgress') {
            store.filter("started", "true");
        }
        store.load();
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
	/*
	 * Showing not installed carrers (menu to install new career).
	 */
    addCareer: function(){
		
		knowledgeFields = this.daoController.getknowledgesFields();
		console.log(knowledgeFields);
		var view12 = this.getCareersframe();
		view12.down('careerslist').show();
		view12.down('careerslistempty').hide();
        view12.down('careerslist').refresh();
		options=[];
		for (var i = 0; i < knowledgeFields.length; i++) {
			options.push({text: knowledgeFields[i], value: knowledgeFields[i]});
		}
		view12.down('selectfield[name=knnowledge_field]').setOptions(options);
				
        var store = Ext.getStore('Careers');
        store.clearFilter();
        store.filter('installed', 'false');
		
        var view12 = this.getCareersframe();
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
	/*
	 * Searching for specific career by writing in searchbox.
	 */
    search: function(values, form){
        form = form.toLowerCase();
        var store = Ext.getStore('Carrers');
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
