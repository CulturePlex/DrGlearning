/*jshint
    forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:false,
    undef:true, curly:true, browser:true, indent:4, maxerr:50
*/
Ext.define('DrGlearning.controller.UserSettingsController', {
	extend : 'Ext.app.Controller',

	init : function() {

	},

	onLaunch : function() {

	},
	settings : function() {
		var userStore = Ext.getStore('Users');
		userStore.load();
		var view = this.getSettings();
		if (!view) {
			view = Ext.create('DrGlearning.view.Settings');
		}
		if (!view.getParent()) {
			Ext.Viewport.add(view);
		}
		view.show();
		this.getCareersframe().hide();
		var usernameField = view.down('textfield[id=username]');
		var emailField = view.down('textfield[id=email]');
		var user = userStore.getAt(0);
		//emailField.setValue(user.data.email);
		//usernameField.setValue(user.data.name);
	},
	saveSettings : function() {
		//var userStore = Ext.getStore('Users');
		//userStore.load();
		var view = this.getSettings();
		//var usernameField = view.down('textfield[id=username]').getValue();
		//var emailField = view.down('textfield[id=email]').getValue();
		//var user = userStore.getAt(0);
		//user.set('name', usernameField);
		//user.set('email', emailField);
		//user.save();
		//userStore.sync();
		var locale = view.down('selectfield[id=locale]').getValue();
		if(localStorage.catalogue!=locale){
			localStorage.catalogue=locale;
			Ext.Msg.alert(i18n.gettext('Language changed'),i18n.gettext('You need to restart this app to see the changes') , Ext.emptyFn);
		}
		view.hide();
		this.getCareersframe().show();
	},
	exportUser : function() {
		var userStore = Ext.getStore('Users');
		userStore.load();
		var user = userStore.getAt(0);
		var view = this.getSettings();
		view.hide();
		new Ext.MessageBox().show({
			title : 'Export user',
			msg : i18n.gettext('Copy and paste in your new device:'),
			items : [ {
				xtype : 'textfield',
				label : i18n.gettext('Copy and paste in your new device:'),
				name : 'id',
				id : 'id',
				labelAlign : 'top',
				value : user.data.uniqueid,
				clearIcon : false
			} ],
			multiline : true,
			buttons : Ext.Msg.OK,
			icon : Ext.Msg.INFO
		});

	},
	importUser : function() {
		var userStore = Ext.getStore('Users');
		userStore.load();
		var user = userStore.getAt(0);
		var view = this.getSettings();
		view.hide();
		var saveButton = Ext.create('Ext.Button', {
			scope : this,
			text : i18n.gettext('Save')
		});
		var cancelButton = Ext.create('Ext.Button', {
			scope : this,
			text : i18n.gettext('Cancel')
		});
		var show = new Ext.MessageBox().show({
			id : 'info',
			title : 'Import user',
			msg : i18n.gettext('Paste your previous ID:'),
			items : [ {
				xtype : 'textfield',
				labelAlign : 'top',
				clearIcon : false,
				value : '',
				id : 'importvalue'
			} ],
			buttons : [ cancelButton, saveButton ],
			icon : Ext.Msg.INFO
		});
		saveButton.setHandler(function() {
			show.hide();
			user.data.uniqueid = show.down('#importvalue').getValue();
			user.save();
			this.destroy(show);
		});
		cancelButton.setHandler(function() {
			show.hide();
			this.destroy(show);
		});
	},
	importUserAction : function(ola, adios) {
		console.log('Not implemented');
	}
});
