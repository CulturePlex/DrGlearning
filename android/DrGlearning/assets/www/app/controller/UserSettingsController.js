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
		console.log('Settings');
		console.log(view);
		if (!view) {
			view = Ext.create('DrGlearning.view.Settings');
		}
		if (!view.getParent()) {
			Ext.Viewport.add(view);
		}
		view.show();
		var usernameField = view.down('textfield[id=username]');
		var emailField = view.down('textfield[id=email]');
		var user = userStore.first();
		emailField.setValue(user.data.email);
		usernameField.setValue(user.data.name);
	},
	saveSettings : function() {
		var userStore = Ext.getStore('Users');
		userStore.load();
		var view = this.getSettings();
		var usernameField = view.down('textfield[id=username]').getValue();
		var emailField = view.down('textfield[id=email]').getValue();
		var user = userStore.first();
		user.set('name', usernameField);
		user.set('email', emailField);
		user.save();
		userStore.sync();
		view.hide();
	},
	exportUser : function() {
		var userStore = Ext.getStore('Users');
		userStore.load();
		var user = userStore.first();
		var view = this.getSettings();
		view.hide();
		new Ext.MessageBox().show({
			title : 'Export user',
			msg : 'Copy and paste in your new device:',
			items : [ {
				xtype : 'textfield',
				label : 'Copy and paste in your new device:',
				name : 'id',
				id : 'id',
				labelAlign : 'top',
				value : user.data.uniqueid,
				clearIcon : false,
			} ],
			multiline : true,
			buttons : Ext.Msg.OK,
			icon : Ext.Msg.INFO
		});

	},
	importUser : function() {
		var userStore = Ext.getStore('Users');
		userStore.load();
		var user = userStore.first();
		var view = this.getSettings();
		view.hide();
		var saveButton = Ext.create('Ext.Button', {
			scope : this,
			text : 'Save',
		});
		var cancelButton = Ext.create('Ext.Button', {
			scope : this,
			text : 'Cancel',
		});
		var show = new Ext.MessageBox().show({
			id : 'info',
			title : 'Import user',
			msg : 'Paste your previous ID:',
			items : [ {
				xtype : 'textfield',
				labelAlign : 'top',
				clearIcon : false,
				value : '',
				id : 'importvalue',
			} ],
			buttons : [ cancelButton, saveButton ],
			icon : Ext.Msg.INFO,
		});
		saveButton.setHandler(function() {
			show.hide();
			user.data.uniqueid = show.down('#importvalue').getValue();
			user.save();
			userStore.sync();
		});
		cancelButton.setHandler(function() {
			show.hide();
			this.destroy(show);
		});
	},
	importUserAction : function(ola, adios) {
		console.log('Not implemented');
	},
});