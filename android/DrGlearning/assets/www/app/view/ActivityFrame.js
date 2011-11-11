Ext.define('DrGlearning.view.ActivityFrame', {
    extend: 'Ext.Container',
	xtype: 'activityframe',
    requires: [
		'DrGlearning.view.ActivityContent',	
    ],
	config: {
        items: [
            {
				ref: 'toolbar',
                xtype: 'toolbar',
                ui   : 'green',
                docked: 'top',
				name: 'up',
                items: [
                    { xtype: 'spacer', width: 35 },
                    { xtype: 'spacer' },
                    {
                        xtype: 'title',
						id: 'title',
						name: 'title',
                        title: 'Activity Name'
                    },
                    { xtype: 'spacer' }
                  
                ]
            },{
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'gray',
                items:[
                    {
						xtype: 'button',
						id: 'backtolevel',
						text: 'Back',
						ui: 'back',
						controller: 'DrGlearning.controller.Career',
						action: 'index',
					}]
                
            },
			{
				xtype: 'activitycontent',
			}
        ],

        layout: 'fit'
    }
});