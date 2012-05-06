Ext.define('DrGlearning.view.Settings', {
	extend : 'Ext.Container',
	xtype : 'settings',
config: {
    	fullscreen: true,
        items: [
            {
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'spacer'
            }, {
                xtype: 'title',
                title: i18n.gettext("Settings")
            }, {
                xtype: 'spacer'
            }]
        },{
            xtype: 'selectfield',
            id: 'locale',
			ui:'dark',
            label: i18n.gettext('Language'),
            labelAlign: 'top',
            margin: 5,
            options: [
                {text: 'English',  value: 'en'},
                {text: 'French',  value: 'fr'},
            ]
        },/*, {
			xtype : 'textfield',
			label : i18n.gettext('Username'),
			name : 'username',
			id : 'username',
			labelAlign : 'top',
			margin: 5,
		}, {
			xtype : 'textfield',
			label : i18n.gettext('Email'),
			name : 'email',
			id : 'email',
			labelAlign : 'top',
			margin: 5,
		}, {
			xtype : 'button',
			text : i18n.gettext('Import user'),
			id : 'import'
		}, {
			xtype : 'button',
			text : i18n.gettext('Export user'),
			id : 'export'
		}*/{
                xtype: 'toolbar',
                docked: 'bottom',
                items:[
                    {
                        xtype: 'button',
						id: 'backFromSettings',
                        text: i18n.gettext('Back'),
						ui:'back',
                        
                    },
					{
						 xtype: 'spacer' 
					},
					{
                        xtype: 'button',
                        text: i18n.gettext('Save'),
						id: 'saveSettings',
                        
                    }
					]
                
            }
		
		]
	},

	animationDuration : 300,

	/*
	 * show: function(animation) { //this.callParent();
	 * 
	 * Ext.Animator.run([{ element : this.element, xclass :
	 * 'Ext.fx.animation.SlideIn', direction: Ext.os.deviceType == "Phone" ?
	 * "up" : "left", duration : this.animationDuration }, { element :
	 * 'ext-mask-1', xclass : 'Ext.fx.animation.FadeIn', duration:
	 * this.animationDuration }]); },
	 * 
	 * hide: function(animation) { var me = this, mask =
	 * Ext.getCmp('ext-mask-1');
	 * 
	 * //we fire this event so the controller can deselect all items
	 * immediately. this.fireEvent('hideanimationstart', this);
	 * 
	 * //show the mask element so we can animation it out (it is already shown
	 * at this point) mask.show();
	 * 
	 * Ext.Animator.run([{ element : me.element, xclass :
	 * 'Ext.fx.animation.SlideOut', duration : this.animationDuration,
	 * preserveEndState: false, direction: Ext.os.deviceType == "Phone" ? "down" :
	 * "right", onEnd: function() { me.setHidden(true); mask.setHidden(true); } }, {
	 * element : 'ext-mask-1', xclass : 'Ext.fx.animation.FadeOut', duration:
	 * this.animationDuration }]); },
	 */

	initialize : function() {

	},

});
