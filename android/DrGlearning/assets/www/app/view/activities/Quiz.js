Ext.define('DrGlearning.view.activities.Quiz', {
    extend: 'Ext.Panel',
    xtype : 'visual',
    config: {
        id: 'activity',
        customId: 'activity',
        layout: 'fit',
        items: [
			{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'neutral',
				customId: 'query',
				layout: {
		            type: 'hbox',
					pack : 'center' 
		        },
				height:40,
            },
			{
                xtype: 'toolbar',
                docked: 'bottom',
                items:[
                    {
						xtype: 'button',
						customId: 'backtolevel',
						text: i18n.gettext('Back'),
						ui: 'back',
						customId: 'backtolevel',
						controller: 'DrGlearning.controller.Career',
						action: 'index',
					},
					{
						 xtype: 'spacer' 
					}]
            },
			{
                xtype: 'panel',
                layout:'vbox',
				customId: 'time',
				cls:'imageBehindButtons'
            }
		]
    },
	
	
});
