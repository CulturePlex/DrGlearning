Ext.define('DrGlearning.view.activities.Relational', {

	extend : 'Ext.Container',
	xtype : 'relational',
	customId:'activity',
	config : {
		id:'activity',
		customId:'activity',
	    layout : {
        type: 'vbox',
        align: 'left',
	    padding:10,
   },
		fullscreen : true,
		scrollable: true,
		items : [ {
			xtype : 'panel',
			id : 'contentSencha',
			customId : 'contentSencha',
		}, 
		{
                xtype: 'container',
                docked: 'top',
                ui: 'neutral',
				customId: 'query',
				layout: {
		            type: 'hbox',
					pack : 'center' 
		        },

				height:60,
                               
            },{
			xtype : 'toolbar',
			docked : 'bottom',
			items : [ {
				xtype : 'button',
				text : 'Back',
				ui : 'back',
				customId: 'backtolevel',
				controller : 'DrGlearning.controller.Career',
				action : 'index'
			}, {
				xtype : 'spacer'
			} ]

		},
		{
			xtype : 'toolbar',
			docked : 'bottom',
			ui:'neutral',
			customId:'constraintsbar',
			 defaults: {
                iconMask: true
            }
		},
		{
			xtype : 'container',
			docked : 'bottom',
			ui:'neutral',
			customId:'scorebar',
			 defaults: {
                iconMask: true
            }
		}
		 ]
	}
});
